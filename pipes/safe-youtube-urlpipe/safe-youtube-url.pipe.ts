import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeYoutubeURL'
})
export class MxSafeYoutubeURLPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    /* Changes public url for embed url */
    if (url.includes('watch?v=')) {
      url = url.replace('watch?v=', 'embed/');
    }

    /* Changes no cookie url */
    if (url.includes('youtu.be')) {
      url = url.replace('youtu.be/', 'www.youtube-nocookie.com/');
    } else if (url.includes('youtube.com')) {
      url = url.replace('youtube.com/', 'youtube-nocookie.com/');
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
