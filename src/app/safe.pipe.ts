import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any): SafeResourceUrl {
    // Assuming your API returns the avatarBytes as base64 encoded string
    const imageSrc = `data:image/jpeg;base64,${value}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(imageSrc);
  }
}