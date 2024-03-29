import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeerJsService } from '../core/services/peer-js.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { APP_CONFIG } from '../../environments/environment';

@Component({
  selector: 'app-pre-connect',
  templateUrl: './pre-connect.component.html',
  styleUrls: ['./pre-connect.component.scss']
})
export class PreConnectComponent implements OnInit {
  nicknameField = '';
  missingNickname = false;
  faSpinner = faSpinner;
  loading = false;

  constructor(private router: Router, private peerJsService: PeerJsService) {  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    if(!APP_CONFIG.production) {
      this.peerJsService.connect('devlogin', () => {
        this.loading = false;
        this.router.navigate(['connected']);
      });
    }

  }

  tryConnect() {
    // Check nickname not empty
    if(this.nicknameField === '') {
      this.missingNickname = true;
      return;
    }
    this.missingNickname = false;

    this.loading = true;
    this.peerJsService.connect(this.nicknameField, () => {
      console.log('Connected?');
      this.loading = false;
      this.router.navigate(['connected']);
    });
  }
}
