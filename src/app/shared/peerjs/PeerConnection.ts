import { EventEmitter } from '@angular/core';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { BehaviorSubject } from 'rxjs';
import { PeerMessageData } from './PeerMessageData';
import { PeerMessageDataType } from './PeerMessageDataType';

export class PeerConnection {
    peer: Peer;
    id: string;
    nickname: string;
    connected = new BehaviorSubject<boolean>(false);
    connections: Map<string, DataConnection>;
    mediaObjects: Map<string, MediaStream>;
    calls: Map<string, MediaConnection>;
    isStreaming: boolean;
    peerNicknameDictionary: {[key: string]: string};
    onNewPeerConnectedEvent: EventEmitter<string>;
    onPeerDisconnectedEvent: EventEmitter<string>;
    onMediaStreamsChanged: EventEmitter<Array<MediaStream>>;
    onStoppedStreaming: EventEmitter<void>;

    constructor(nickname: string) {
      this.onNewPeerConnectedEvent = new EventEmitter();
      this.onPeerDisconnectedEvent = new EventEmitter();
      this.onMediaStreamsChanged = new EventEmitter();
      this.onStoppedStreaming = new EventEmitter();
      this.nickname = nickname;
      this.isStreaming = false;
      this.connections = new Map();
      this.mediaObjects = new Map();
      this.calls = new Map();
      this.peer = new Peer();
      this.peer.on('open', this.onPeerServerConnected.bind(this));
      this.peer.on('call', this.onPeerRemoteCallAttempt.bind(this));
      this.peer.on('error', this.onPeerError.bind(this));
      this.peer.on('connection', this.onPeerRemoteConnectionEstablished.bind(this));
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

      const conn = this.peer.connect(remoteId);


      this.registerPeerConnectionCallbacks(conn);

      console.log('Connecting...');
    }

    removePeer(remoteId: string) {
      const remoteConnection = this.connections.get(remoteId);
      if(remoteConnection !== undefined) {
        remoteConnection.send(new PeerMessageData(PeerMessageDataType.close));
        for(const call of this.calls.values()) {
          if(call.peer === remoteId) {
            this.handleCallClose(call);
          }
        }

        remoteConnection.close();
      }
    }

    startStream(stream) {
      this.mediaObjects.set(this.id, stream);
      this.isStreaming = true;

      for (const remoteId of this.connections.keys()) {
        this.initateStreamCall(remoteId);
      }
      this.emitOnMediaStreamsChanged();
    }

    stopStream() {
      this.mediaObjects.get(this.id).getTracks().forEach(function(track) {
        track.stop();
      });

      for (const remoteId of this.connections.keys()) {
        this.connections.get(remoteId).send(new PeerMessageData(PeerMessageDataType.stopMyStream));
      }

      this.mediaObjects.delete(this.id);

      for (const i of this.calls.keys()) {
        const call = this.calls.get(i);
        if (call.localStream) {
          call.close();
        }
      }

      this.isStreaming = false;
      this.onStoppedStreaming.emit();
      this.emitOnMediaStreamsChanged();
    }

    // Helper functions

    private isPeerIdInvalid(peerId: string) {
      return  peerId === ''       || // Empty
              peerId === this.id  || // Self
              this.connections.hasOwnProperty(peerId); // Already connected
    }

    private sendNicknameToPeer(remotePeer: string) {
      this.connections.get(remotePeer).send({nickname: this.nickname});
    }

    private initateStreamCall(remoteId: string) {
      const stream = this.mediaObjects.get(this.id);
      const call = this.peer.call(remoteId, stream);
      call.on('error', this.onPeerError.bind(this));
      this.calls.set(remoteId, call);
      console.log('Calling remote ' + remoteId);
    }

    private registerPeerConnectionCallbacks(remoteConnection: DataConnection) {
      remoteConnection.on('open', () => {
        this.onNewPeerConnectedEvent.emit(remoteConnection.peer);
        console.log(remoteConnection.peer + ' connected!');
        this.connections.set(remoteConnection.peer, remoteConnection);
        if (this.isStreaming) {
           this.initateStreamCall(remoteConnection.peer);
        }
        this.sendNicknameToPeer(remoteConnection.peer);
      });
      remoteConnection.on('error', this.onPeerConnectionError.bind(this));
      remoteConnection.on('data', (data: PeerMessageData) => {
        this.onPeerConnectionData(data, remoteConnection);
      });
      remoteConnection.on('close', () => {
        this.connections.get(remoteConnection.peer).close();
        this.connections.delete(remoteConnection.peer);
        this.onPeerDisconnectedEvent.emit(remoteConnection.peer);
        this.handleCallClose(this.calls.get(remoteConnection.peer));
        this.emitOnMediaStreamsChanged();
        console.log(this.connections);
        console.log('Disconnected');
      });
    }

    private handleCallClose(call: MediaConnection) {
      if(call && call.open) {
        call.close();
        console.log('Closed call to: ' + call.peer);
        this.mediaObjects.delete(call.peer);
        this.emitOnMediaStreamsChanged();
      }
    }

    private emitOnMediaStreamsChanged() {
      console.log(this.mediaObjects);
      this.onMediaStreamsChanged.emit(Array.from(this.mediaObjects.values()));
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
      this.registerPeerConnectionCallbacks(remoteConnection);
    }

    private onPeerRemoteCallStream(stream: MediaStream, call: MediaConnection) {
      this.mediaObjects.set(call.peer, stream);
      stream.addEventListener('removetrack', () => {});
      this.emitOnMediaStreamsChanged();
    }

    private onPeerRemoteCallAttempt(call: MediaConnection) {
      console.log('Receiving a call from: ' + call.peer);
      call.answer();
      this.calls.set(call.peer, call);
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
        switch(data.type) {
          case PeerMessageDataType.close:
            console.log('Close his call');
            /*for (let i in this.calls) {
              let call = this.calls[i]
              if (call.peer === conn.peer) {
                call.close()
                console.log('Closed call to: ' + call.peer)
                delete this.mediaObjects[call.peer]
                this.mediaCallback(this.mediaObjects, this.peerNicknameDictionary)
              }
            }
            conn.close()*/
            break;
          case PeerMessageDataType.stopMyStream:
            for (const i of this.calls.keys()) {
              const call = this.calls.get(i);
              if (call.peer === conn.peer && call.remoteStream) {
                this.handleCallClose(call);
              }
            }
            break;
          case PeerMessageDataType.nickname:
            this.peerNicknameDictionary[conn.peer] = data.content;
            //this.connectionCallback(this.connections, this.peerNicknameDictionary)
            console.log(this.peerNicknameDictionary);
            break;
        }
    }
}
