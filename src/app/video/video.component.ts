import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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
  countLike: number = 0;
  countDislike: number = 0; 
  isButtonDisabled = false;
  likebtnClick = false;
  dislikebtnClick = false;
  ifCreator = false;
  showPopup = false;
  showNestedPopup = false;
  playlistTitle: string = "";

  recommendedVideos: any = [];

  myPlaylists: any = [];

  SubscribeBtn: any = {
    ActiveBtn: false,
    Disabled: false
  };

  constructor(
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private el: ElementRef,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.videoName = params['id']; // Assuming the route parameter is named 'id'
      console.log("Video name: " + this.videoName)
      this.fetchVideoBytes();

      this.fetchRecommendedVids(Number(this.video.contentType));
    });
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Parse the JSON string to get the user object
      this.user = JSON.parse(storedUser);
      console.log("User Data: ");
      console.log(this.user);
      this.fetchUserData();
    } else {
      // Handle the case when there is no user data
    }
  }

  // Fetch video bytes
  async fetchVideoBytes() {
    const token = this.cookieService.get('refreshToken');
  
    try {
      const response = await axios.get(`http://localhost:8085/video/${this.videoName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
      });
  
      if (response.status === 200) {
        this.video = response.data;
        console.log("Video: ", this.video);
        if(this.video.userId === this.user.id){
          this.ifCreator = true;
        }

        this.fetchRecommendedVids(this.video.contentType);
  
        await this.updateCounts(token); // Update counts after video data is fetched
        this.getComments();
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
      // Handle error, maybe set a default video or display an error message
    }
  }
  fetchRecommendedVids(category: number): void {
    const token = this.cookieService.get('refreshToken');

    const headers = {
        Authorization: `Bearer ${token}`
    };

    // Make Axios GET request to fetch recommended videos
    axios.get(`http://localhost:8085/home/sort?videoCategoryId=${category}`, { headers })
        .then(response => {
            // Handle successful response
            this.recommendedVideos = response.data.filter((video: any) => video.id !== this.video.id);
            console.log("RECOMMENDED VIDS");
            console.log(this.recommendedVideos);
        })
        .catch(error => {
            // Handle error
            console.error('Error fetching recommended videos:', error);
        });
    }
  async updateCounts(token: string): Promise<void> {
    try {
      this.countLike = await this.getCountLike(token);
      this.countDislike = await this.getCountDislike(token);
    } catch (error) {
      console.error('Error updating counts:', error);
      // Handle error as needed
    }
  }
  //get like and dislike
  async getCountDislike(token: string): Promise<number> {
    try {
      const response = await axios.get(`http://localhost:8085/grade/countdislike`, {
        params: { videoId: this.video.id },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
        responseType: 'blob',
      });
  
      return response?.status === 200 ? +(await response.data.text()) : 0;
    } catch (error) {
      console.error('Error fetching countLikes:', error);
      return 0; // Return a default value or handle it as needed
    }
  }

  fetchUserData(): void {
    // Retrieve the bearer token from cookies
    const bearerToken = this.cookieService.get('refreshToken');
  
    // Define the URL for the GET request
    const url = 'http://localhost:8085/channels/channel-user';
  
    // Define headers including the bearer token
    const headers = {
      Authorization: `Bearer ${bearerToken}`,
      Accept: '*/*',
    };
  
    // Send the GET request using Axios
    
    axios.get(url, { headers })
  .then(response => {
    // Handle successful response
    console.log('User data response:', response.data);
    // Check if there are any users in the response array
    if (response.data.length > 0) {
      // Access the avatarBytes of the first user in the array
      this.user.pfp = response.data[0].avatarBytes;
    } else {
      console.error('No user data found.');
    }
  })
  .catch(error => {
    // Handle error
    console.error('Error fetching user data:', error);
    // Perform error handling such as displaying an error message
  });
  }

  async getCountLike(token: string): Promise<number> {
    try {
      const response = await axios.get(`http://localhost:8085/grade/countlike`, {
        params: { videoId: this.video.id },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
        responseType: 'blob',
      });
  
      return response?.status === 200 ? +(await response.data.text()) : 0;
    } catch (error) {
      console.error('Error fetching countLikes:', error);
      return 0; // Return a default value or handle it as needed
    }
  }
  //Handle actions Like Dislike
  handleLikeDislike(gradeId: number): void {
    const videoId = this.video.id;
    const token = this.cookieService.get('refreshToken');
  
    this.isButtonDisabled = true;
    axios.get('http://localhost:8085/grade/like', {
      params: { grade_id: gradeId, video_id: videoId },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
      }
    })
      .then(response => {
        // Handle the response if needed 
        console.log('Successfully added like/dislike:', response);
        if (gradeId === 1) {
          this.likebtnClick = true;
          this.getCountLike(token).then(count => {
            this.countLike = count;
          });
        }
        if (gradeId === 2) {
          this.dislikebtnClick = true;
          this.getCountDislike(token).then(count => {
            this.countDislike = count;
          });
        }
      })
      .catch(error => {
        // Handle the error, display an error message, etc.
        console.error('Error adding like/dislike:', error);
      });
  }
  //Subscribe to the creator of the video
  handleSubscribe() {
    const token = this.cookieService.get('refreshToken');
    const formData = new FormData();
    formData.append('target_user_id', this.video.userId.toString()); // Make sure userId is a string
    console.log("USER FOLLOW: " + this.video.userId);

    // this.SubscribeBtn.ActiveBtn = true;
    this.SubscribeBtn.Disabled = true;
    
    axios.post('http://localhost:8085/subs/add-sub', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(response => {
      // Handle the response as needed
      console.log('Subscription successful:', response.data);
    })
    .catch(error => {
      // Handle errors
      console.error('Error subscribing:', error);
    });
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
  navigateToVideoDetails(video: any): void {
    this.router.navigate(['/video', video.id]);
  }
  openPopup() {
    this.showPopup = true;
    this.fetchUserPlaylists();
  }
  async fetchUserPlaylists() {
    const token = this.cookieService.get('refreshToken');
    try {
      const response = await axios.get('http://localhost:8085/playlist/user-playlists', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      this.myPlaylists = response.data;
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  }
  toggleNestedPopup() {
    this.showNestedPopup = true;
  }
  submitPlaylist(){
    this.createPlaylist();
  }
  async createPlaylist() {
    const token = this.cookieService.get('refreshToken');
    const formData = new FormData();
    formData.append('title', this.playlistTitle);
    formData.append('accessStatus', '1'); // Leaving accessStatus to 1 by default
  
    try {
      const response = await axios.post('http://localhost:8085/playlist/create-playlist', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Playlist created:', response.data);
      this.showNestedPopup = false;
      this.fetchUserPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  }
  addToPlaylist(playlist: any) {
    const token = this.cookieService.get('refreshToken'); // Assuming you have token management logic
    const formData = new FormData();
    formData.append('playListId', playlist.id); // Assuming the playlist object has an id property
    formData.append('videoId', this.video.id); // Leave videoId empty

    try {
      axios.post('http://localhost:8085/list_video/add-video-playlist', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        console.log('Video added to playlist:', response.data);
        this.closePopup();
      }).catch(error => {
        console.error('Error adding video to playlist:', error);
      });
    } catch (error) {
      console.error('Error adding video to playlist:', error);
    }
  }
  closePopup() {
    this.showPopup = false;
    this.showNestedPopup = false;
  }
}