import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-connect',
  templateUrl: './pre-connect.component.html',
  styleUrls: ['./pre-connect.component.scss']
})
export class PreConnectComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
  }

}
