import { EventEmitter } from '@angular/core';
import { Console } from 'console';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { BehaviorSubject } from 'rxjs';
import { PeerConfiguration } from './PeerConfiguration';
import { PeerConnection } from './PeerConnection';
import { PeerMessageData } from './PeerMessageData';
import { PeerMessageDataType } from './PeerMessageDataType';

export class PeerInstance {
    peer: Peer;
    id: string;
    nickname: string;
    connected = new BehaviorSubject<boolean>(false);
    peerConnections: Map<string, PeerConnection> = new Map();
    isStreaming: boolean;
    myStream: MediaStream = undefined;
    peerNicknameDictionary: {[key: string]: string};
    onNewPeerConnectedEvent: EventEmitter<PeerConnection>;
    onPeerDisconnectedEvent: EventEmitter<PeerConnection>;
    onMediaStreamsChanged: EventEmitter<Array<PeerConnection>>;
    onStoppedStreaming: EventEmitter<void>;
    selfConnection: PeerConnection;

    constructor(nickname: string, configuration: PeerConfiguration) {
      this.onNewPeerConnectedEvent = new EventEmitter();
      this.onPeerDisconnectedEvent = new EventEmitter();
      this.onMediaStreamsChanged = new EventEmitter();
      this.onStoppedStreaming = new EventEmitter();
      this.nickname = nickname;
      this.isStreaming = false;
      const iceConfig = [];
      for(const ice of configuration.iceServers) {
        iceConfig.push({url: ice});
      }
      this.peer = new Peer(undefined,
        {
          host: configuration.host,
          port: configuration.port,
          pingInterval: configuration.pingInterval,
          secure: configuration.secure,
          config: iceConfig});
      this.peer.on('open', this.onPeerServerConnected.bind(this));
      this.peer.on('call', this.onPeerRemoteCallAttempt.bind(this));
      this.peer.on('error', this.onPeerError.bind(this));
      this.peer.on('connection', this.onPeerRemoteConnectionEstablished.bind(this));

      this.selfConnection = new PeerConnection(null);
      this.selfConnection.id = this.id;
      this.selfConnection.nickname = this.nickname;
    }

    destroy() {
      // TODO: Disconnect all connections
      this.peer.disconnect();
    }

    addPeer(remoteId: string) {
      if (this.isPeerIdInvalid(remoteId))
      {
        return;
      }

      const conn = this.peer.connect(remoteId, {
        metadata: {
          nickname: this.nickname
        }
    });


      this.registerPeerConnectionCallbacks(conn);

      console.log('Connecting...');
    }

    removePeer(remoteId: string) {
      const remoteConnection = this.peerConnections.get(remoteId);
      if(remoteConnection !== undefined) {
        remoteConnection.sendConnectionClose();
        this.handleCallClose(remoteConnection.call);
        remoteConnection.close();
      }
    }

    startStream(stream) {
      this.myStream = stream;
      this.isStreaming = true;

      for (const remoteId of this.peerConnections.keys()) {
        this.initateStreamCall(remoteId);
      }
      this.emitOnMediaStreamsChanged();
    }

    stopStream() {
      this.myStream.getTracks().forEach(function(track) {
        track.stop();
      });

      for (const connection of this.peerConnections.values()) {
        connection.sendStopMyStream();
        if(connection.call?.localStream) {
          this.handleCallClose(connection.call);
        }
      }

      this.myStream = undefined;
      this.isStreaming = false;
      this.onStoppedStreaming.emit();
      this.emitOnMediaStreamsChanged();
    }

    acceptConnection(peerConnection: PeerConnection) {
      if (this.isStreaming) {
        this.initateStreamCall(peerConnection.id);
     }
    }

    denyConnection(peerConnection: PeerConnection) {
      peerConnection.close();
    }

    // Helper functions

    private isPeerIdInvalid(peerId: string) {
      return  peerId === ''       || // Empty
              peerId === this.id  || // Self
              this.peerConnections.hasOwnProperty(peerId); // Already connected
    }

    private initateStreamCall(remoteId: string) {
      const stream = this.myStream;
      const call = this.peer.call(remoteId, stream);
      call.on('error', this.onPeerError.bind(this));
      this.peerConnections.get(remoteId).call = call;
      console.log('Calling remote ' + remoteId);
    }

    private registerPeerConnectionCallbacks(remoteConnection: DataConnection, incoming = false) {
      remoteConnection.on('open', () => {
        console.log(remoteConnection.peer + ' connected!');
        const peerConnection = new PeerConnection(remoteConnection);
        peerConnection.nickname = remoteConnection.metadata.nickname;
        peerConnection.selfInitiated = incoming;
        this.peerConnections.set(remoteConnection.peer, peerConnection);
        this.onNewPeerConnectedEvent.emit(peerConnection);
      });
      remoteConnection.on('error', this.onPeerConnectionError.bind(this));
      remoteConnection.on('data', (data: PeerMessageData) => {
        this.onPeerConnectionData(data, remoteConnection);
      });
      remoteConnection.on('close', () => {
        const otherPeer = this.peerConnections.get(remoteConnection.peer);
        otherPeer.close();
        this.handleCallClose(otherPeer.call);
        this.peerConnections.delete(remoteConnection.peer);
        this.onPeerDisconnectedEvent.emit(otherPeer);
        console.log(this.peerConnections);
        console.log('Disconnected');
      });
    }

    private handleCallClose(call: MediaConnection) {
      if(call) {
        console.log(call);
        this.peerConnections.get(call.peer).closeCall();
        this.emitOnMediaStreamsChanged();
      }
    }

    private emitOnMediaStreamsChanged() {
      const streams: PeerConnection[] = [];
      if(this.myStream) {
        this.selfConnection.stream = this.myStream;
        streams.push(this.selfConnection);
      }

      for(const peerConnection of this.peerConnections.values()) {
        if(peerConnection.stream) {
          streams.push(peerConnection);
        }
      }
      console.log(streams);

      this.onMediaStreamsChanged.emit(streams);
    }

    // Peer Callbacks

    private onPeerServerConnected(assignedId: string) {
      console.log(this);
      this.connected.next(true);
      this.id = assignedId;
      console.log('My ID: %s', this.id);
    }

    private onPeerError(error: Error) {
      console.error(error);
    }

    private onPeerRemoteConnectionEstablished(remoteConnection: DataConnection) {
      console.log('Got remote connection: ' + remoteConnection.peer);
      this.registerPeerConnectionCallbacks(remoteConnection, true);
    }

    private onPeerRemoteCallStream(stream: MediaStream, call: MediaConnection) {
      this.peerConnections.get(call.peer).stream = stream;
      this.emitOnMediaStreamsChanged();
    }

    private onPeerRemoteCallAttempt(call: MediaConnection) {
      console.log('Receiving a call from: ' + call.peer);
      call.answer();
      this.peerConnections.get(call.peer).call = call;
      call.on('error', this.onPeerError.bind(this));
      call.on('stream', (stream: MediaStream) => {
        this.onPeerRemoteCallStream(stream, call);
      });
      call.on('close', () => {
        this.handleCallClose(call);
      });
    }

    // Peer Connection Callbacks

    private onPeerConnectionError(error: Error) {
      console.error(error);
    }

    private onPeerConnectionData(data: PeerMessageData, conn: DataConnection) {
        console.log('Got data: ');
        console.log(data);
        const peerConnection = this.peerConnections.get(conn.peer);
        switch(data.type) {
          case PeerMessageDataType.close:
            console.log('Close his call');
            this.handleCallClose(peerConnection.call);
            peerConnection.close();
            break;
          case PeerMessageDataType.stopMyStream:
            this.handleCallClose(this.peerConnections.get(conn.peer).call);
            break;
        }
    }
}
