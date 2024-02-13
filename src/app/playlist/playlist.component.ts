import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css'
})
export class PlaylistComponent implements OnInit {
  user: any;
  menuLogoSrc = 'assets/images/LogoImg.png';
  expandedIcons: Map<string, boolean> = new Map<string, boolean>();
  myPlaylists: any = [];
  videoPlaylist: any = [];
  playlistId: number = 0;
  selectedVidFromPlaylist: any;

  constructor(private router: Router, private cookieService: CookieService, private route: ActivatedRoute) {}
  iconsData = [
    { iconSrc: 'assets/icons/home_icon.png', text: 'Home' },
    { iconSrc: 'assets/icons/videos_icon.png', text: 'Videos' },
    { iconSrc: 'assets/icons/category_icon.png', text: 'Categories' },
    { iconSrc: 'assets/icons/menu_icon.png', text: 'Menu' }
  ];

  ngOnInit() {
    this.playlistId = this.getPlaylistIdFromUrl();
    // Store user data to display later
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log(this.user);
      if (!this.user.photoUrl.startsWith("http")) {
        this.fetchUserData();
      } 
      this.fetchVideoPlaylist();
    } else {
      // Handle the case when there is no user data
    }

    // Initialize expanded state for each icon
    this.iconsData.forEach(iconData => {
      this.expandedIcons.set(iconData.text, false); // Set to false to keep them closed at the start
    });
  }
  getPlaylistIdFromUrl(): number {
    const urlSegments = this.route.snapshot.url;
    if (urlSegments.length > 0) {
      const lastSegment = urlSegments[urlSegments.length - 1];
      return +lastSegment.path;
    }
    return 0;
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
      console.log("USER DATA:");
      console.log(response.data);
      this.user.pfp = response.data[0].avatarBytes;
      if(response.data[0].bannerByte != null){
        const bannerImage = `url(data:image/jpeg;base64,${response.data[0].bannerByte})`;
        const welcomeBanner = document.querySelector('.welcome_banner') as HTMLElement;
        if (welcomeBanner) {
          console.log("changed background");
          welcomeBanner.style.backgroundImage = bannerImage;
        }
      }
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
  expandMenu() {
    // Change width to 20vw
    const menuContainer = document.querySelector('.menu_container') as HTMLElement;
    if (menuContainer) {
      menuContainer.setAttribute('style', 'width: 20vw; justify-content: left;');
    }

    // Change logo image source and set its width to 10vw
    this.menuLogoSrc = 'assets/images/logo.png';
  }
  selectVideoFromPlaylist(video: any): void {
    this.selectedVidFromPlaylist = video;
    // Perform any additional logic if needed
}
  //FETCH ALL VIDEOS FROM PLAYLIST
  async fetchVideoPlaylist() {
    const token = this.cookieService.get('refreshToken');
    try {
      const formData = new FormData();
      formData.append('playListId', this.playlistId.toString());
      console.log("PLAYLIST: " + this.playlistId);
      
      const response = await axios.get(`http://localhost:8085/list_video/all-video-playlist?playListId=${this.playlistId}`, {
      headers: {
      Authorization: `Bearer ${token}`
  }
});

      this.videoPlaylist = response.data;
      console.log('Video Playlist:', this.videoPlaylist);
    } catch (error) {
      console.error('Error fetching video playlist:', error);
    }
  }
  //FETCH ALL PLAYLIST FOR DISPLAY
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
  playSelectedVideo() {
    if (this.selectedVidFromPlaylist) {
        const videoId = this.selectedVidFromPlaylist.id;
        this.router.navigate(['/video', videoId]);
    }
}
  toggleIcon(iconName: string): void {
    this.expandedIcons.set(iconName, !this.expandedIcons.get(iconName));
    if(iconName == "Menu"){
      this.fetchUserPlaylists()
    }
  }
  navigateToPlaylist(playlistId: string) {
    const navigationExtras: NavigationExtras = {
        replaceUrl: true // Set replaceUrl to true to replace the current URL
    };
    this.router.navigate(['/playlist', playlistId], navigationExtras);
  }
  navigateToRoute(routePath: string) {
    this.router.navigate([routePath]);
  }
}
