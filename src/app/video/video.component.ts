import { Component, OnInit } from '@angular/core';
import { VideoService } from './video.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent implements OnInit {
  video: any;

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.video = this.videoService.getVideo();
  }

  videoSource = 'assets/videos/quickvid.mp4';
  currentTime = '0:00';

  updateTime() {
    const video = document.querySelector('video') as HTMLVideoElement;
    const minutes = Math.floor(video.currentTime / 60);
    const seconds = Math.floor(video.currentTime % 60);
    this.currentTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}