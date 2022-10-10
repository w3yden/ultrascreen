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
    isStreaming: boolean;
    peerNicknameDictionary: {[key: string]: string};
    onNewPeerConnectedEvent: EventEmitter<string>;

    constructor(nickname: string) {
      this.onNewPeerConnectedEvent = new EventEmitter();
      this.nickname = nickname;
      this.isStreaming = false;
      this.connections = new Map();
      this.peer = new Peer();
      this.peer.on('open', this.onPeerServerConnected.bind(this));
      this.peer.on('call', this.onPeerRemoteCallAttempt);
      this.peer.on('error', this.onPeerError);
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

    // Helper functions

    private isPeerIdInvalid(peerId: string) {
      return  peerId === ''       || // Empty
              peerId === this.id  || // Self
              this.connections.hasOwnProperty(peerId); // Already connected
    }

    private sendNicknameToPeer(remotePeer: string) {
      this.connections[remotePeer].send({nickname: this.nickname});
    }

    private registerPeerConnectionCallbacks(remoteConnection: DataConnection) {
      remoteConnection.on('open', () => {
        this.onNewPeerConnectedEvent.emit(remoteConnection.peer);
        console.log(remoteConnection.peer + ' connected!');
        this.connections[remoteConnection.peer] = remoteConnection;
        if (this.isStreaming) {
          // this.initiateStreamCall(conn.peer, this.currentStream)
        }
        this.sendNicknameToPeer(remoteConnection.peer);
      });
      remoteConnection.on('error', this.onPeerConnectionError.bind(this));
      remoteConnection.on('data', this.onPeerConnectionData.bind(this));
      remoteConnection.on('close', () => {
        this.connections[remoteConnection.peer].close();
        // delete this.mediaObjects[conn.peer]
        delete this.connections[remoteConnection.peer];
        // this.connectionCallback(this.connections)
        // this.mediaCallback(this.mediaObjects, this.peerNicknameDictionary)
        console.log(this.connections);
        console.log('Disconnected');
      });
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

    private onPeerRemoteCallAttempt(mediaConnection: MediaConnection) {

    }

    // Peer Connection Callbacks

    private onPeerConnectionError(error: Error) {
      console.error(error);
    }

    private onPeerConnectionData(data: PeerMessageData) {
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
            /*for (let i in this.calls) {
              let call = this.calls[i]
              if (call.peer === conn.peer && call.remoteStream) {
                call.close()
                console.log('Closed call to: ' + call.peer)
                delete this.mediaObjects[call.peer]
                this.mediaCallback(this.mediaObjects, this.peerNicknameDictionary)
              }
            }*/
            break;
          case PeerMessageDataType.nickname:
            this.peerNicknameDictionary[data.senderId] = data.content;
            //this.connectionCallback(this.connections, this.peerNicknameDictionary)
            console.log(this.peerNicknameDictionary);
            break;
        }
    }
}
