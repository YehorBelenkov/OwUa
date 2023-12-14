import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
  
    // Check if navigation is not null and extras.state is defined
    if (navigation && navigation.extras && navigation.extras.state) {
      this.user = {
        email: navigation.extras.state['userEmail'],
        photoURL: navigation.extras.state['userPfp']
      };
    } else {
      // Handle the case when there is no user data
    }
  }

  menuLogoSrc = 'assets/images/LogoImg.png';

  expandedIcons: Map<string, boolean> = new Map<string, boolean>();

  iconsData = [
    { iconSrc: 'assets/icons/home_icon.png', text: 'Home' },
    { iconSrc: 'assets/icons/videos_icon.png', text: 'Videos' },
    { iconSrc: 'assets/icons/category_icon.png', text: 'Categories' },
    { iconSrc: 'assets/icons/menu_icon.png', text: 'Menu' }
  ];

  ngOnInit() {
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
  }

  expandMenu() {
    // Change width to 20vw
    const menuContainer = document.querySelector('.menu_container') as HTMLElement;
    if (menuContainer) {
      menuContainer.setAttribute('style', 'width: 20vw');
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
  }
}