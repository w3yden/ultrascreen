import { Component, Input, OnInit } from '@angular/core';
import { PeerConfiguration } from '../shared/peerjs/PeerConfiguration';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {
  @Input() configuration: PeerConfiguration;
  display: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  showDialog() {
    this.display = true;
  }

}
