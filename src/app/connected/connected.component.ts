import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { PeerJsService } from '../core/services/peer-js.service';
import { ToastrService } from 'ngx-toastr';
import { PeerInstance } from '../shared/peerjs/PeerInstance';
import { fromEvent, Subscription } from 'rxjs';
import { StreamScreenPickerComponent } from '../stream-screen-picker/stream-screen-picker.component';
import { PeerConnection } from '../shared/peerjs/PeerConnection';
import Peer from 'peerjs';
import { PeerConnectionDialogComponent } from '../peer-connection-dialog/peer-connection-dialog.component';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { PeerConfiguration } from '../shared/peerjs/PeerConfiguration';

@Component({
  selector: 'app-connected',
  templateUrl: './connected.component.html',
  styleUrls: ['./connected.component.scss'],
})
export class ConnectedComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChild('streamScreenPicker')
  streamScreenPicker: StreamScreenPickerComponent;
  @ViewChild('peerConnectionDialog')
  peerConnectionDialog: PeerConnectionDialogComponent;
  @ViewChild('settingsDialog')
  settingsDialog: SettingsDialogComponent;

  nickname: string;
  peerId: string;
  connectionList: Array<PeerConnection>;
  mediaStreams: Array<PeerConnection>;
  newPeerId = '';
  streaming = false;
  connection: PeerInstance = undefined;
  peerConnectionSubscription: Subscription;
  focusedConnection: PeerConnection = undefined;
  hasFocusedConnection = false;
  newConnection: PeerConnection = undefined;
  showConnectionDialog = false;
  configuration: PeerConfiguration;

  constructor(
    private router: Router,
    private peerJsService: PeerJsService,
    private toastrService: ToastrService
  ) {}

  ngAfterContentInit(): void {
    this.peerConnectionSubscription = this.peerJsService.connection.subscribe(
      (connection: PeerInstance | null) => {
        if (connection === null || connection === undefined) {
          console.log('No peer connection exists');
          this.connection = undefined;
          setTimeout(() => {
            this.router.navigate(['home']);
          }, 200);
          return;
        }
        if (this.connection !== undefined) {
          return;
        }
        console.log('PeerInstance: ', connection);

        this.connection = connection;

        connection?.onNewPeerConnectedEvent.subscribe(
          (newConnection: PeerConnection) => {
            this.connectionList.push(newConnection);
            // TODO: If another peer connects, the previous popup gets overwritten.
            if(newConnection.selfInitiated) {
              this.newConnection = newConnection;
              this.showConnectionDialog = true;
            }
            this.toastrService.success(newConnection.nickname, 'Peer connected');
          }
        );
        connection?.onPeerDisconnectedEvent.subscribe(
          (removedPeer: PeerConnection) => {
            const n = this.connectionList.findIndex(
              (value) => value.id === removedPeer.id
            );
            console.log(n);
            if (n !== -1) {
              this.toastrService.warning(removedPeer.nickname, 'Peer disconnected');
              this.connectionList.splice(n, 1);
            }
          }
        );
        connection?.onMediaStreamsChanged.subscribe(
          (mediaStreams: PeerConnection[]) => {
            console.log(mediaStreams);
            this.mediaStreams = mediaStreams;
          }
        );
        connection?.onStoppedStreaming.subscribe(() => {
          this.streaming = false;
        });
        this.nickname = connection?.nickname;
        this.peerId = connection?.id;
      }
    );
    this.configuration = this.peerJsService.peerConfiguration;
  }

  ngOnInit(): void {
    this.connectionList = new Array<PeerConnection>();
    this.hasFocusedConnection = false;
    this.focusedConnection = undefined;

    this.nickname = '';
    this.peerId = '';
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
    this.toastrService.info('Copied ID!', null, { timeOut: 1000 });
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
    if (this.streaming) {
      this.connection?.stopStream();
    } else {
      this.streamScreenPicker.showPicker();
    }
  }

  toggleFocus(connection: PeerConnection) {
    console.log('focus');
    if (this.focusedConnection === undefined && connection !== undefined) {
      this.focusedConnection = connection;
      this.hasFocusedConnection = true;
    } else {
      this.hasFocusedConnection = false;
      this.focusedConnection = undefined;
    }
  }

  openCredits() {
    this.settingsDialog.showDialog();
  }
}
