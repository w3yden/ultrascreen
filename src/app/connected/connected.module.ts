import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailRoutingModule } from './connected-routing.module';

import { ConnectedComponent } from './connected.component';
import { SharedModule } from '../shared/shared.module';

import { SidebarModule } from 'primeng/sidebar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [ConnectedComponent],
  imports: [CommonModule, SharedModule, DetailRoutingModule, SidebarModule, BrowserAnimationsModule]
})
export class ConnectedModule {}
