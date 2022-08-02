import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent, LogoComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { SidepanelComponent } from './components/sidepanel/sidepanel.component';

@NgModule({
  declarations: [PageNotFoundComponent, LogoComponent, WebviewDirective, SidepanelComponent],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, LogoComponent, SidepanelComponent]
})
export class SharedModule {}
