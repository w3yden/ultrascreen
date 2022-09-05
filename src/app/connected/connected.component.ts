import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeerConnection, PeerJsService } from '../core/services/peer-js.service';

@Component({
  selector: 'app-connected',
  templateUrl: './connected.component.html',
  styleUrls: ['./connected.component.scss']
})
export class ConnectedComponent implements OnInit {

  constructor(private router: Router, private peerJsService: PeerJsService) {   }

  nickname: string
  peerId: string

  ngOnInit(): void {
    this.peerJsService.connection.subscribe((connection: PeerConnection | null) => {
      console.log("Update: ", connection)
      if(connection === null) {
        setTimeout(() => {
          this.router.navigate(['home'])
        }, 200)
        return
      }
      this.nickname = connection?.nickname
      this.peerId = connection?.id
    });
    console.log('DetailComponent INIT');
   }

   disconnect() {
    this.peerJsService.disconnect()
   }

}
