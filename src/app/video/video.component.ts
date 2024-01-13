import { Component, OnInit } from '@angular/core';
import { VideoService } from './video.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent implements OnInit {
  video: any;
  comments: any[] = [];

  constructor(private videoService: VideoService, private http: HttpClient) {}

  ngOnInit(): void {
    this.video = this.videoService.getVideo();
    this.fetchComments();
  }

  videoSource = 'assets/videos/quickvid.mp4';
  currentTime = '0:00';

  updateTime() {
    const video = document.querySelector('video') as HTMLVideoElement;
    const minutes = Math.floor(video.currentTime / 60);
    const seconds = Math.floor(video.currentTime % 60);
    this.currentTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  fetchComments() {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMUBtYWlsLmNvbSIsImlhdCI6MTcwNTA4Nzc3MiwiZXhwIjoxNzA1MTc0MTcyfQ.8kFfbrhW4BDkWkxWVNiuuYI7HbMdmZWmPGmzxKnWH04'; // Replace with your actual access token

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('videoId', '2'); // Replace with your actual videoId

    this.http.post<any[]>('http://localhost:8085/comment/all', formData, { headers })
      .subscribe(
        (response) => {
          this.comments = response;
          console.log('Comments fetched successfully!', this.comments);
        },
        (error) => {
          console.error('Error fetching comments:', error);
        }
      );
  }
}