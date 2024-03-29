import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { VideoService } from './video.service';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home', 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  user: any;
  videos: any[] = []; 
  categories: any[] = [];
  filteredVideos: any[] = [];
  selectedCategory: string | null = null;
  searchQuery: string = '';
  myPlaylists: any = [];

  constructor(
      private videoService: VideoService,
      private cookieService: CookieService,
      private router: Router,
      private renderer: Renderer2,
      private el: ElementRef,
    ) {}

  menuLogoSrc = 'assets/images/LogoImg.png';

  expandedIcons: Map<string, boolean> = new Map<string, boolean>();

  iconsData = [
    { iconSrc: 'assets/icons/home_icon.png', text: 'Home' },
    { iconSrc: 'assets/icons/videos_icon.png', text: 'Videos' },
    { iconSrc: 'assets/icons/category_icon.png', text: 'Categories' },
    { iconSrc: 'assets/icons/menu_icon.png', text: 'Menu' }
  ];

  ngOnInit() {
    //store user data to display after
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Parse the JSON string to get the user object
      this.user = JSON.parse(storedUser);
      console.log(this.user);
      if (!this.user.photoUrl.startsWith("http")) {
        this.fetchUserData();
      } 
      
    } else {
      // Handle the case when there is no user data
    }
    // Add event listener to close expanded icons on menu mouseleave
    const menuContainer = document.querySelector('.menu_container') as HTMLElement;
    if (menuContainer) {
      menuContainer.addEventListener('mouseleave', () => {
        // Close all expanded icons
        this.iconsData.forEach(iconData => {
          this.expandedIcons.set(iconData.text, false);
        });
      });
    }

    const bearerToken = this.cookieService.get('refreshToken');

    // Set up headers
    const headers = {
      'Authorization': `Bearer ${bearerToken}`,
      'Accept': '*/*',
      'Access-Control-Allow-Origin': '*',
      // Add other headers as needed
    };

    // Make Axios GET request to fetch video data
    axios.get('http://nikstep.com.ua:8085/video/all', { headers })
    .then(response => {
      this.videos = response.data;
      console.log('Video data:', this.videos);
    
      console.log("Video data:");
      console.log(this.videos);
    })
    .catch(error => {
      console.error('Error fetching video data:', error);
    });

    axios.get('http://nikstep.com.ua:8085/category/all-category', { headers })
      .then(response => {
        this.categories = response.data;
        console.log(this.categories);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
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
    const logoImage = document.querySelector('.logo_closed_menu') as HTMLElement;
    if (logoImage) {
      logoImage.setAttribute('style', 'width: 10vw');
    }
  
    // Show the icon_text elements
    const iconTextElements = document.querySelectorAll('.icon_text') as NodeListOf<HTMLElement>;
    iconTextElements.forEach(textElement => {
      textElement.style.display = 'block';
    });
    
    // Show the hidden_icon elements
    const hiddenIconElements = document.querySelectorAll('.hidden_icon') as NodeListOf<HTMLElement>;
    hiddenIconElements.forEach(hiddenIconElement => {
      hiddenIconElement.style.display = 'block';
    });
  
    // Initialize expanded state for each icon
    this.iconsData.forEach(iconData => {
      this.expandedIcons.set(iconData.text, false);
    });
  
    // Add click event listeners to arrow_icon elements
    const arrowIconElements = document.querySelectorAll('.arrow_icon') as NodeListOf<HTMLElement>;
    arrowIconElements.forEach(arrowIcon => {
      arrowIcon.addEventListener('click', () => {
        const iconName = arrowIcon.getAttribute('data-icon');
        if (iconName) {
          // Toggle the expanded state for the clicked icon
          this.expandedIcons.set(iconName, !this.expandedIcons.get(iconName));
        }
      });
    });
  }

  fetchUserData(): void {
    // Retrieve the bearer token from cookies
    const bearerToken = this.cookieService.get('refreshToken');
  
    // Define the URL for the GET request
    const url = 'http://nikstep.com.ua:8085/channels/channel-user';
  
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
  resetMenu() {
    // Reset width
    const menuContainer = document.querySelector('.menu_container') as HTMLElement;
    if (menuContainer) {
      menuContainer.removeAttribute('style');
    }
  
    // Reset logo image source and set its width back to 2.5vw
    this.menuLogoSrc = 'assets/images/LogoImg.png';
    const logoImage = document.querySelector('.logo_closed_menu') as HTMLElement;
    if (logoImage) {
      logoImage.setAttribute('style', 'width: 2vw');
    }
  
    // Hide the icon_text elements
    const iconTextElements = document.querySelectorAll('.icon_text') as NodeListOf<HTMLElement>;
    iconTextElements.forEach(textElement => {
      textElement.style.display = 'none';
    });
  
    const hiddenIconElements = document.querySelectorAll('.hidden_icon') as NodeListOf<HTMLElement>;
    hiddenIconElements.forEach(hiddenIconElement => {
      hiddenIconElement.style.display = 'none';
    });
  }

  toggleIcon(iconName: string): void {
    this.expandedIcons.set(iconName, !this.expandedIcons.get(iconName));
    if(iconName == "Menu"){
      this.fetchUserPlaylists()
    }
  }
  async fetchUserPlaylists() {
    const token = this.cookieService.get('refreshToken');
    try {
      const response = await axios.get('http://nikstep.com.ua:8085/playlist/user-playlists', {
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

  //Filter videos to display!
  selectCategory(categoryId: string) {
    console.log('Category clicked:', categoryId);
  
    // Toggle active class
    if (this.selectedCategory === categoryId) {
      // If the same category is clicked twice, empty the filter
      this.selectedCategory = null;
    } else {
      this.selectedCategory = categoryId;
    }
  
    this.filterVideos(); // Ensure this method is being called
  }

// Add this method
filterVideos() {
  if (this.selectedCategory) {
    this.filteredVideos = this.videos.filter(video => video.contentType == this.selectedCategory);
    console.log(this.filteredVideos);
  } else {
    this.filteredVideos = this.videos;
  }
}
// Add the searchVideos method
searchVideos() {
  // If the search query is not empty
  if (this.searchQuery.trim() !== '') {
    // Filter videos based on the search query and selected category
    this.filteredVideos = this.videos.filter(video =>
      (video.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (!this.selectedCategory || video.contentType === this.selectedCategory)
    );
  } else {
    // If the search query is empty
    if (this.selectedCategory) {
      // If a category is selected, filter videos based on the category
      this.filteredVideos = this.videos.filter(video => video.contentType === this.selectedCategory);
    } else {
      // If no search query and no category selected, display all videos
      this.filteredVideos = this.videos;
    }
  }
}
//routing to another video
navigateToVideoDetails(video: any): void {
  this.router.navigate(['/video', video.id]);
}
navigateToPlaylist(playlistId: string) {
  this.router.navigate(['/playlist', playlistId]);
}
navigateToRoute(routePath: string) {
  this.router.navigate([routePath]);
}
}