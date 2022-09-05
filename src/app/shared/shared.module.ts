import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent, LogoComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { SidepanelComponent } from './components/sidepanel/sidepanel.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [PageNotFoundComponent, LogoComponent, WebviewDirective, SidepanelComponent],
  imports: [CommonModule, TranslateModule, FontAwesomeModule, FormsModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, LogoComponent, SidepanelComponent, FontAwesomeModule, InputTextModule, ButtonModule]
})
export class SharedModule {}
