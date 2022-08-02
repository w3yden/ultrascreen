import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './pre-connect-routing.module';

import { PreConnectComponent } from './pre-connect.component';
import { SharedModule } from '../shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [PreConnectComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule, InputTextModule, ButtonModule]
})
export class PreConnectModule {}
