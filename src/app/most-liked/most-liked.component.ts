import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-most-liked',
  templateUrl: './most-liked.component.html',
  styleUrls: ['./most-liked.component.css']
})
export class MostLikedComponent implements OnInit {
  user: any;
  menuLogoSrc = 'assets/images/LogoImg.png';
  expandedIcons: Map<string, boolean> = new Map<string, boolean>();
  likedvids: any = [];
  primaryVid: any;

  constructor(private router: Router, private cookieService: CookieService) {}

  iconsData = [
    { iconSrc: 'assets/icons/home_icon.png', text: 'Home' },
    { iconSrc: 'assets/icons/videos_icon.png', text: 'Videos' },
    { iconSrc: 'assets/icons/category_icon.png', text: 'Categories' },
    { iconSrc: 'assets/icons/menu_icon.png', text: 'Menu' }
  ];

  ngOnInit() {
    // Store user data to display later
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log(this.user);
      if (!this.user.photoUrl.startsWith("http")) {
        this.fetchUserData();
      } 
      this.fetchLikedVideos();
    } else {
      // Handle the case when there is no user data
    }

    // Initialize expanded state for each icon
    this.iconsData.forEach(iconData => {
      this.expandedIcons.set(iconData.text, false); // Set to false to keep them closed at the start
    });
  }
  fetchLikedVideos(): void {
    const bearerToken = this.cookieService.get('refreshToken');
    axios.get('http://localhost:8085/grade/liked-videos/1', {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })
      .then(response => {
        console.log('Liked videos:', response.data);
        this.likedvids = response.data;
        // Here you can assign the data to a property in your component
      })
      .catch(error => {
        console.error('Error fetching liked videos:', error);
      });
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

  toggleIcon(iconName: string): void {
    // Toggle the expanded state for the clicked icon
    this.expandedIcons.set(iconName, !this.expandedIcons.get(iconName));
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
  markAsPrimary(video: any): void {
    
    console.log('Selected video:', video);
    this.primaryVid = video;
    console.log("CHANGED");
}
  
  navigateToVideo(videoId: number): void {
    // Navigate to the video details page with the video ID
    this.router.navigate(['/video', videoId]);
}
navigateToRoute(routePath: string) {
  this.router.navigate([routePath]);
}
}