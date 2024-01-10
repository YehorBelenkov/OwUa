import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  getVideo(): any {
    // Replace this with actual video data or API call
    return {
      title: 'Sample Video Title',
      url: 'https://www.youtube.com/embed/5986IgwaVKE',
      description: 'This is a sample video description.',
    };
  }
}