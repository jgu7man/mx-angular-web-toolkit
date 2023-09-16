import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MxSafeYoutubeURLPipe } from './safe-youtube-url.pipe';

@NgModule({
  declarations: [MxSafeYoutubeURLPipe],
  imports: [CommonModule],
  exports: [MxSafeYoutubeURLPipe]
})
export class MxSafeYoutubeURLPipeModule {}
