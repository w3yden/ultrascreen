import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PeerConnection } from '../../shared/peerjs/PeerConnection';

@Injectable({
  providedIn: 'root'
})
export class PeerJsService {
  public connectionSubject = new BehaviorSubject<PeerConnection>(null);
  readonly connection = this.connectionSubject.asObservable();
  peerConnection: PeerConnection = undefined;

  constructor() {
  }

  connect(nickname: string, connectedCallback: () => void) {
    if(this.peerConnection !== undefined) {
      this.peerConnection.connected.unsubscribe();
    }
    console.log('Create PeerConnection Instance');

    this.peerConnection = new PeerConnection(nickname);
    this.peerConnection.connected.subscribe((isConnected) => {
      console.log(isConnected);
      console.log(this.peerConnection);
      if(isConnected) {
        console.log('Notify new peerConnection instance');
        connectedCallback();
        this.connectionSubject.next(this.peerConnection);
      }
    });
  }

  disconnect() {
    if(this.connectionSubject.value !== null) {
      this.connectionSubject.getValue().destroy();
      this.connectionSubject.next(null);
      console.log('Disconnect.');
    }
  }

}
