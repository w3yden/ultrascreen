import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StreamPeerBlockComponent } from './stream-peer-block.component';

@NgModule({
  declarations: [StreamPeerBlockComponent],
  imports: [CommonModule],
  exports: [StreamPeerBlockComponent],
})
export class StreamPeerBlockModule {}
