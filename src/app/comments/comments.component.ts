import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: any[] = []; // This array will store the comments retrieved from the API
  newCommentText: string = ''; // Variable to store the new comment text

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchComments();
  }

  fetchComments() {
    // ... existing code
  }

  addComment() {
    const apiUrl = 'http://nikstep.com.ua:8085/comment/add-comment';
    const headers = {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMUBtYWlsLmNvbSIsImlhdCI6MTcwNjEyMzE3NiwiZXhwIjoxNzA2MjA5NTc2fQ.yIT9dMniXGb4SEtkRhEE1kVtVpVJ0re4udBpT0Er3b4',
      'Accept': '*/*',
      'Access-Control-Allow-Origin': '*'
    };

    const requestBody = {
      authorizationHeader: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMUBtYWlsLmNvbSIsImlhdCI6MTcwNjEyMzE3NiwiZXhwIjoxNzA2MjA5NTc2fQ.yIT9dMniXGb4SEtkRhEE1kVtVpVJ0re4udBpT0Er3b4',
      text: this.newCommentText,
      video_id: 2 // Replace with the appropriate video_id
    };

    // Making the POST request using Axios
    axios.post(apiUrl, requestBody, { headers })
      .then((response: any) => {
        console.log('Comment added successfully', response.data);
        this.fetchComments(); // Refresh the comments after adding a new one
        this.newCommentText = ''; // Clear the input field
      })
      .catch((error) => {
        console.error('Error adding comment', error);
      });
  }
}