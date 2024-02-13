import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  menuLogoSrc = 'assets/images/LogoImg.png';
  expandedIcons: Map<string, boolean> = new Map<string, boolean>();
  user: any;

  name: string = '';
  email: string = '';
  password: string = '';
  bannerFile: any;
  avatarFile: any;

  iconsData = [
    { iconSrc: 'assets/icons/home_icon.png', text: 'Home' },
    { iconSrc: 'assets/icons/videos_icon.png', text: 'Videos' },
    { iconSrc: 'assets/icons/category_icon.png', text: 'Categories' },
    { iconSrc: 'assets/icons/menu_icon.png', text: 'Menu' }
  ];

  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit() {
    // Store user data to display later
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log(this.user);
      if (!this.user.photoUrl.startsWith("http")) {
        this.fetchUserData();
      } 
    } else {
      // Handle the case when there is no user data
    }

    // Initialize expanded state for each icon
    this.iconsData.forEach(iconData => {
      this.expandedIcons.set(iconData.text, false); // Set to false to keep them closed at the start
    });
  }

  onSave() {
    const bearerToken = this.cookieService.get('refreshToken');
  
    if (this.bannerFile != null) {
      // Create FormData object
      const bannerFormData = new FormData();
      bannerFormData.append('photoUrl', this.bannerFile);
  
      // Send Axios POST request to update banner
      axios.post('http://localhost:8085/user/update-banner', bannerFormData, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      .then(response => {
        console.log('Banner updated successfully:', response.data);
        // Optionally, perform any additional actions after successful update
      })
      .catch(error => {
        console.error('Error updating banner:', error);
        // Optionally, handle the error
      });
    }
  
    if (this.avatarFile != null) {
      // Create FormData object
      const avatarFormData = new FormData();
      avatarFormData.append('photoUrl', this.avatarFile);
  
      // Send Axios POST request to update avatar
      axios.post('http://localhost:8085/user/update-image', avatarFormData, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      .then(response => {
        console.log('Avatar updated successfully:', response.data);
        // Optionally, perform any additional actions after successful update
      })
      .catch(error => {
        console.error('Error updating avatar:', error);
        // Optionally, handle the error
      });
    }
    window.location.reload();
  }
  onBannerFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.bannerFile = inputElement.files[0];
    }
  }
  
  onAvatarFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.avatarFile = inputElement.files[0];
    }
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
  navigateToRoute(routePath: string) {
    this.router.navigate([routePath]);
  }
  toggleIcon(iconName: string): void {
    // Toggle the expanded state for the clicked icon
    this.expandedIcons.set(iconName, !this.expandedIcons.get(iconName));
  }
}
