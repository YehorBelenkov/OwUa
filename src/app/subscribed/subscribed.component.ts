import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscribed',
  templateUrl: './subscribed.component.html',
  styleUrls: ['./subscribed.component.css']
})
export class SubscribedComponent implements OnInit {
  videos: any[] = [];
  loading: boolean = true;
  user: any;
  menuLogoSrc = 'assets/images/LogoImg.png';

  constructor(
    private cookieService: CookieService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {}
  iconsData = [
    { iconSrc: 'assets/icons/home_icon.png', text: 'Home' },
    { iconSrc: 'assets/icons/videos_icon.png', text: 'Videos' },
    { iconSrc: 'assets/icons/category_icon.png', text: 'Categories' },
    { iconSrc: 'assets/icons/menu_icon.png', text: 'Menu' }
  ];
  expandedIcons: Map<string, boolean> = new Map<string, boolean>();

  ngOnInit() {
    this.getVideoSubscriptions();
    // Store user data to display later
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log(this.user);
      this.fetchUserData();
    } else {
      // Handle the case when there is no user data
    }

    // Initialize expanded state for each icon
    this.iconsData.forEach(iconData => {
      this.expandedIcons.set(iconData.text, false); // Set to false to keep them closed at the start
    });
  }
  toggleIcon(iconName: string): void {
    // Toggle the expanded state for the clicked icon
    this.expandedIcons.set(iconName, !this.expandedIcons.get(iconName));
  }

  getVideoSubscriptions() {
    const bearerToken = this.cookieService.get('refreshToken');
    const headers = {
      'Authorization': `Bearer ${bearerToken}`,
      'Accept': '*/*',
      'Access-Control-Allow-Origin': '*',
      // Add other headers as needed
    };

    axios.get('http://localhost:8085/subs/get-video-sub-user', { headers })
      .then((response) => {
        this.videos = response.data;
        console.log("VIDEO SUB");
        console.log(this.videos);
      })
      .catch((error) => {
        console.error('Axios Error:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  navigateHome() {
    this.router.navigate(['/']);
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
  expandMenu() {
    // Change width to 20vw
    const menuContainer = document.querySelector('.menu_container') as HTMLElement;
    if (menuContainer) {
      menuContainer.setAttribute('style', 'width: 20vw; justify-content: left;');
    }

    // Change logo image source and set its width to 10vw
    this.menuLogoSrc = 'assets/images/logo.png';
  }
  navigateToVideoDetails(video: any): void {
    this.router.navigate(['/video', video.videoId]);
  }
}