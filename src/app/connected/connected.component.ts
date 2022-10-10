import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PeerJsService } from '../core/services/peer-js.service';
import { ToastrService } from 'ngx-toastr';
import { PeerConnection } from '../shared/peerjs/PeerConnection';
import { fromEvent, Subscription } from 'rxjs';
import { StreamScreenPickerComponent } from '../stream-screen-picker/stream-screen-picker.component';

@Component({
  selector: 'app-connected',
  templateUrl: './connected.component.html',
  styleUrls: ['./connected.component.scss']
})
export class ConnectedComponent implements OnInit, OnDestroy {
  @ViewChild('streamScreenPicker') streamScreenPicker: StreamScreenPickerComponent;
  nickname: string;
  peerId: string;
  connectionList: Array<string>;
  mediaStreams: Array<MediaStream>;
  newPeerId = '';
  streaming = false;
  connection: PeerConnection = undefined;
  peerConnectionSubscription: Subscription;

  constructor(private router: Router, private peerJsService: PeerJsService, private toastrService: ToastrService) {   }

  ngOnInit(): void {
    this.connectionList = new Array<string>();

    this.peerConnectionSubscription = this.peerJsService.connection.subscribe((connection: PeerConnection | null) => {
      if(connection === null || connection === undefined) {
        console.log('No peer connection exists');
        this.connection = undefined;
        setTimeout(() => {
          this.router.navigate(['home']);
        }, 200);
        return;
      }
      console.log(this.connection);
      if(this.connection !== undefined) {
        return;
      }
      console.log('Update: ', connection);

      this.connection = connection;

      connection?.onNewPeerConnectedEvent.subscribe((newConnection) => {
        this.connectionList.push(newConnection);
      });
      connection?.onPeerDisconnectedEvent.subscribe((removedPeer: string) => {
        console.log('asd');
        const n = this.connectionList.findIndex((value) =>  value === removedPeer);
        console.log(n);
        if(n !== -1) {
          this.toastrService.warning('Peer disconnected', null);
          this.connectionList.splice(n, 1);
        }
      });
      connection?.onMediaStreamsChanged.subscribe((mediaStreams: MediaStream[]) => {
        console.log(mediaStreams);
        this.mediaStreams = mediaStreams;
      });
      connection?.onStoppedStreaming.subscribe(() => {
        this.streaming = false;
      });
      this.nickname = connection?.nickname;
      this.peerId = connection?.id;
    });
    console.log('DetailComponent INIT');
   }

   ngOnDestroy(): void {
       console.log('DetailComponent DESTROY');
       this.peerConnectionSubscription.unsubscribe();
   }

   onStreamSelected(stream) {
    this.connection?.startStream(stream);
    this.streaming = true;
   }

   copyMyId() {
    navigator.clipboard.writeText(this.peerId);
    this.toastrService.info('Copied!', null, {timeOut: 1000});
   }

   disconnect() {
    this.peerJsService.disconnect();
   }

   addPeer() {
    this.connection?.addPeer(this.newPeerId);
    this.newPeerId = '';
   }

   removePeer(peerId: string) {
    this.connection?.removePeer(peerId);
   }

   openStreamScreenPicker() {
      if(this.streaming) {
        this.connection?.stopStream();
      } else {
        this.streamScreenPicker.showPicker();
      }
    }

   openCredits() {

   }

}
