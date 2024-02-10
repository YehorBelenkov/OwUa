import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'video'
})
export class VideoPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any): SafeResourceUrl {
    if (!value) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(''); // or any default SafeResourceUrl
    }
  
    const videoSrc = `data:video/mp4;base64,${value}`;
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoSrc);
    console.log(safeUrl); // Log the SafeResourceUrl to the console
    return safeUrl;
  }
}