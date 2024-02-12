import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})
export class SubscriptionsComponent {
  user: any;
  menuLogoSrc = 'assets/images/LogoImg.png';
  expandedIcons: Map<string, boolean> = new Map<string, boolean>();
  subedUsers: any = [];

  constructor(private router: Router, private cookieService: CookieService,) {}

  iconsData = [
    { iconSrc: 'assets/icons/home_icon.png', text: 'Home' },
    { iconSrc: 'assets/icons/videos_icon.png', text: 'Videos' },
    { iconSrc: 'assets/icons/category_icon.png', text: 'Categories' },
    { iconSrc: 'assets/icons/menu_icon.png', text: 'Menu' }
  ];

  ngOnInit() {
    // Store user data to display later
    const storedUser = localStorage.getItem('user');
    this.fetchSubsData();
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log("User Data: ");
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

  expandMenu() {
    // Change width to 20vw
    const menuContainer = document.querySelector('.menu_container') as HTMLElement;
    if (menuContainer) {
      menuContainer.setAttribute('style', 'width: 20vw; justify-content: left;');
    }

    // Change logo image source and set its width to 10vw
    this.menuLogoSrc = 'assets/images/logo.png';
  }
  fetchSubsData(): void {
    // Retrieve the bearer token from cookies
    const bearerToken = this.cookieService.get('refreshToken');

    // Define the URL for the GET request
    const url = 'http://localhost:8085/subs/subscribed-users';

    // Define headers including the bearer token
    const headers = {
      Authorization: `Bearer ${bearerToken}`,
      Accept: '*/*',
    };

    // Send the GET request using Axios
    axios.get(url, { headers })
      .then(response => {
        // Handle successful response
        console.log('Subscribed users data response:', response.data);
        this.subedUsers =  response.data;
        // Process the subscribed users data here
      })
      .catch(error => {
        // Handle error
        console.error('Error fetching subscribed users data:', error);
        // Perform error handling such as displaying an error message
      });
  }
  unsubscribeUser(userId: number): void {
    // Retrieve the bearer token from cookies
    const bearerToken = this.cookieService.get('refreshToken');

    // Define the URL for the DELETE request
    const url = 'http://localhost:8085/subs/unsubscribe';

    // Create FormData to include the targetUserId
    const formData = new FormData();
    formData.append('targetUserId', String(userId));

    // Define headers including the bearer token
    const headers = {
      Authorization: `Bearer ${bearerToken}`,
      Accept: '*/*',
    };

    // Send the DELETE request using Axios
    axios.delete(url, { data: formData, headers })
      .then(response => {
        // Handle successful response
        console.log('Unsubscribe response:', response.data);
        // After unsubscribing, fetch the updated subscribed users data
        this.fetchSubsData();
      })
      .catch(error => {
        // Handle error
        console.error('Error unsubscribing user:', error);
        // Perform error handling such as displaying an error message
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
  
  navigateToRoute(routePath: string) {
    this.router.navigate([routePath]);
  }
}
