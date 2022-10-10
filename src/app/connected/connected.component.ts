import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeerJsService } from '../core/services/peer-js.service';
import { ToastrService } from 'ngx-toastr';
import { PeerConnection } from '../shared/peerjs/PeerConnection';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-connected',
  templateUrl: './connected.component.html',
  styleUrls: ['./connected.component.scss']
})
export class ConnectedComponent implements OnInit {
  nickname: string;
  peerId: string;
  connectionList: Array<string>;
  newPeerId = '';

  constructor(private router: Router, private peerJsService: PeerJsService, private toastrService: ToastrService) {   }

  ngOnInit(): void {
    this.connectionList = new Array<string>();

    this.peerJsService.connection.subscribe((connection: PeerConnection | null) => {
      console.log('Update: ', connection);
      if(connection === null) {
        setTimeout(() => {
          this.router.navigate(['home']);
        }, 200);
        return;
      }
      connection?.onNewPeerConnectedEvent.subscribe((newConnection) => {
        this.connectionList.push(newConnection);
      });
      this.nickname = connection?.nickname;
      this.peerId = connection?.id;
    });
    console.log('DetailComponent INIT');
   }

   copyMyId() {
    navigator.clipboard.writeText(this.peerId);
    this.toastrService.info('Copied!', null, {timeOut: 1000});
   }

   disconnect() {
    this.peerJsService.disconnect();
   }

   addPeer() {
    this.peerJsService.connectionSubject.value.addPeer(this.newPeerId);
    this.newPeerId = '';
   }

   openCredits() {

   }

}
