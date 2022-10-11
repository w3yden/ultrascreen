import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeerConnection } from '../shared/peerjs/PeerConnection';

@Component({
  selector: 'app-peer-connection-dialog',
  templateUrl: './peer-connection-dialog.component.html',
  styleUrls: ['./peer-connection-dialog.component.scss']
})
export class PeerConnectionDialogComponent implements OnInit {
  @Input() display: boolean;
  @Input() newConnection: PeerConnection;
  @Output() accepted: EventEmitter<PeerConnection> = new EventEmitter();
  @Output() rejected: EventEmitter<PeerConnection> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public showDialog(peerConnection: PeerConnection) {
    this.display = true;
    this.newConnection = peerConnection;
  }

}
