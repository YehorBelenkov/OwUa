import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chanel',
  templateUrl: './chanel.component.html',
  styleUrl: './chanel.component.css'
}) 
export class ChanelComponent {
  user: any;
  menuLogoSrc = 'assets/images/LogoImg.png';
  expandedIcons: Map<string, boolean> = new Map<string, boolean>();

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
    } else {
      // Handle the case when there is no user data
    }

    // Initialize expanded state for each icon
    this.iconsData.forEach(iconData => {
      this.expandedIcons.set(iconData.text, false); // Set to false to keep them closed at the start
    });
    this.sendGetRequest();
  }
  sendGetRequest(): void {
    // Retrieve the bearer token from cookies
    const bearerToken = this.cookieService.get('refreshToken');

    // Define the URL for the GET request
    const url = 'http://localhost:8085/channels/channel-user-video';

    // Define headers including the bearer token
    const headers = {
      Authorization: `Bearer ${bearerToken}`,
      Accept: '*/*',
    };

    // Send the GET request using Axios
    axios.get(url, { headers })
      .then(response => {
        // Handle successful response
        console.log('Response:', response.data);
        // Process the response data as needed
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
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
  navigateHome() {
    this.router.navigate(['/']);
  }
}
