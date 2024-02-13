import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-watchedvideo',
  templateUrl: './watchedvideo.component.html',
  styleUrls: ['./watchedvideo.component.css']
})
export class WatchedvideoComponent {
  constructor(private http: HttpClient) { }

  likeVideo(videoId: number) {
    const apiUrl = `http://nikstep.com.ua:8085/grade/like?grade_id=1&video_id=${videoId}`;

    // Making the GET request using Angular's HttpClient
    this.http.get(apiUrl)
      .subscribe(
        (response: any) => {
          console.log('Liked video', response);
          // Handle success as needed
        },
        (error) => {
          console.error('Error liking video', error);
          // Handle error as needed
        }
      );
  }

  dislikeVideo(videoId: number) {
    const apiUrl = `http://nikstep.com.ua:8085/grade/dislike?grade_id=2&video_id=${videoId}`;

    // Making the GET request using Angular's HttpClient
    this.http.get(apiUrl)
      .subscribe(
        (response: any) => {
          console.log('Disliked video', response);
          // Handle success as needed
        },
        (error) => {
          console.error('Error disliking video', error);
          // Handle error as needed
        }
      );
  }

  countLikes(videoId: number) {
    const apiUrl = `http://nikstep.com.ua:8085/grade/countlike?videoId=${videoId}`;

    // Making the GET request using Angular's HttpClient
    this.http.get(apiUrl)
      .subscribe(
        (response: any) => {
          console.log('Count of likes', response);
          // Handle success as needed
        },
        (error) => {
          console.error('Error counting likes', error);
          // Handle error as needed
        }
      );
  }

  countDislikes(videoId: number) {
    const apiUrl = `http://nikstep.com.ua:8085/grade/countdislike?videoId=${videoId}`;

    // Making the GET request using Angular's HttpClient
    this.http.get(apiUrl)
      .subscribe(
        (response: any) => {
          console.log('Count of dislikes', response);
          // Handle success as needed
        },
        (error) => {
          console.error('Error counting dislikes', error);
          // Handle error as needed
        }
      );
  }
}