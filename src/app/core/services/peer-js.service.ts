import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PeerConnection } from '../../shared/peerjs/PeerConnection';

@Injectable({
  providedIn: 'root'
})
export class PeerJsService {
  public connectionSubject = new BehaviorSubject<PeerConnection>(null);
  readonly connection = this.connectionSubject.asObservable();

  constructor() {
  }

  connect(nickname: string, connectedCallback: () => void) {
    const peerConnection = new PeerConnection(nickname);
    peerConnection.connected.subscribe((isConnected) => {
      if(isConnected) {
        this.connectionSubject.next(peerConnection);
        connectedCallback();
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
