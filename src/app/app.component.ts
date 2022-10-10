import { Component, OnInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { PrimeNGConfig } from 'primeng/api';
import {
  trigger,
  animate,
  style,
  group,
  query as q,
  transition,
} from '@angular/animations';
import { RouterOutlet } from '@angular/router';

const query = (pStyle, pAnimate, pOptional = { optional: true }) =>
  q(pStyle, pAnimate, pOptional);

const fadeInFromDirection = direction => [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' })),
  group([
    query(':leave', [
      animate('0.2s ease-out', style({ transform: 'translateX(100%)'})),
    ]),
    query(':enter', [
      style({transform: 'translateX(-90%)'}),
      animate('0.2s ease-out', style({ transform: 'translateX(0%)'})),
    ]),
  ]),
];

const routerTransition = trigger('routerTransition', [
  transition('* => forward', fadeInFromDirection('forward')),
  transition('* => backward', fadeInFromDirection('backward')),
]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private primengConfig: PrimeNGConfig,
  ) {
    this.translate.setDefaultLang('en');
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  getPageTransition(routerOutlet: RouterOutlet) {
    if (routerOutlet.isActivated) {
      const { path } = routerOutlet.activatedRoute.routeConfig;
      if(path === 'connected') {
          return 'backward';
      }
      return 'forward';
    }
  }
}
