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
        console.log(this.videos);
        this.videos.forEach((video) => {
          console.log("Running loop: " + video.title)
          // Use the video.id or modify it based on your video data structure
          this.appendVideoToContainer(video.videoBytes);
        });
      })
      .catch((error) => {
        console.error('Axios Error:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  appendVideoToContainer(videoBlobUrl: string) {
    // Check if videoBlobUrl is not null
    if (videoBlobUrl) {
      console.log("Inside append!")
      // Create a video element
      const videoElement = this.renderer.createElement('video');

      // Set attributes for the video element
      this.renderer.setAttribute(videoElement, 'src', videoBlobUrl);
      this.renderer.setAttribute(videoElement, 'controls', 'false');
      this.renderer.setAttribute(videoElement, 'width', '300');
      this.renderer.setAttribute(videoElement, 'height', '200');

      // Add a class to the video element
      this.renderer.addClass(videoElement, 'video');

      // Append the video element to the video_content div with the specified ID
      const allVidsContainer = this.el.nativeElement.querySelector('.allvids');
      if (allVidsContainer) {
        console.log("Appended!")
        this.renderer.appendChild(allVidsContainer, videoElement);
      }
    }
  }
  navigateHome() {
    this.router.navigate(['/']);
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
}