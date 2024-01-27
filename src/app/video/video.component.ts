import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent implements OnInit {
  videoName: string = '';
  videoBlobUrl: string | null = null;
  video: any;
  user: any;
  commentText: string = '';
  comments: any[] = [];

  constructor(
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.videoName = params['id']; // Assuming the route parameter is named 'id'
      this.fetchVideoBytes();
    });
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Parse the JSON string to get the user object
      this.user = JSON.parse(storedUser);
      console.log(this.user);
    } else {
      // Handle the case when there is no user data
    }
  }

  // Fetch video bytes
  fetchVideoBytes() {
    const token = this.cookieService.get('refreshToken');

    // Create FormData and set the "name" field
    const formData = new FormData();
    

    axios
      .get('http://localhost:8085/video/' + this.videoName, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
          // No need to set Content-Type for FormData, Axios will set it automatically
        },
      })
      .then((response) => {
        if (response.status === 200) {
          
          this.video = response.data;

          // console.log(this.video);
          //add to name to then send another api request to get the bytes
          formData.append('name', this.video.name);
          this.getComments();
        } else {
          console.error('Unexpected response status:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error fetching video bytes:', error);
        // Handle error, maybe set a default video or display an error message
      });

    // axios
    //   .post('http://localhost:8085/video/byteVideo', formData, {
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Accept': '*/*',
    //       // No need to set Content-Type for FormData, Axios will set it automatically
    //     },
    //     responseType: 'blob', // Specify the response type as blob
    //   })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       const videoBlob = new Blob([response.data], { type: 'video/mp4' });
    //       this.videoBlobUrl = URL.createObjectURL(videoBlob);
    //       this.appendVideoToContainer();
    //       console.log(response.data);
    //       console.log(this.videoBlobUrl);
    //     } else {
    //       console.error('Unexpected response status:', response.status);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching video bytes:', error);
    //     // Handle error, maybe set a default video or display an error message
    //   });
  }

  // Append the video to the video_container
  appendVideoToContainer() {
    // Check if videoBlobUrl is not null
    if (this.videoBlobUrl) {
      // Create a video element
      const videoElement = this.renderer.createElement('video');
      this.renderer.setAttribute(videoElement, 'src', this.videoBlobUrl);
      this.renderer.setAttribute(videoElement, 'controls', 'true');

      // Append the video element to the video_container
      const videoContainer = this.el.nativeElement.querySelector('.video_container');
      this.renderer.appendChild(videoContainer, videoElement);
    }
  }
  //get all comments
  getComments() {
    const token = this.cookieService.get('refreshToken');
  
    // Use URLSearchParams instead of FormData for GET requests
    const params = new URLSearchParams();
    params.set('videoId', this.video.id);
  
    axios
      .get('http://localhost:8085/comment/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
        params: params, // Pass params as URL parameters
      })
      .then((response) => {
        if (response.status === 200) {
          // Update your video or comment data accordingly
          this.comments = response.data;
          console.log(this.comments);
  
          // Additional logic, if needed
        } else {
          console.error('Unexpected response status:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
        // Handle error, maybe set a default value or display an error message
      });
  }
  // Updated leaveComment function
  leaveComment() {
    // Get the token or authentication data if needed
    const token = this.cookieService.get('refreshToken');

    // Prepare the data to be sent in the request body
    const formData = new FormData();
    formData.append('text', this.commentText);
    formData.append('video_id', this.video.id);

    // Make an Axios POST request (replace 'your/comment/endpoint' with your actual API endpoint)
    axios.post('http://localhost:8085/comment/add-comment', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
      },
    })
    .then(response => {
      // Handle the response as needed
      console.log('Comment posted successfully:', response.data);
      this.commentText = '';
      this.getComments();
      // Optionally, update your UI or perform additional actions
    })
    .catch(error => {
      // Handle errors
      console.error('Error posting comment:', error);
    });
  }
  //copy link
  copyLink() {
    const videoUrl = window.location.href; // Get the current URL or video link

    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = videoUrl;
    document.body.appendChild(tempInput);

    // Select the text in the input
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text to the clipboard
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(tempInput);
  }
}