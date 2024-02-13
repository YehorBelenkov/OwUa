import { Component } from '@angular/core';
import axios from 'axios';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css']
})
export class UploadVideoComponent {
  public file: any = {};
  public uploadProgress: number = 0;
  public uploadCompleted: boolean = false; // Add this variable
  menuLogoSrc = 'assets/images/LogoImg.png';
  expandedIcons: Map<string, boolean> = new Map<string, boolean>();
  user: any;

  constructor(private cookieService: CookieService, private storage: AngularFireStorage, private router: Router) {}

  video = {
    title: '',
    description: '',
    file: null as HTMLInputElement | null,
    categoryId: 0, // Add this line
    accessStatusId: 0 // Add this line
  };
  iconsData = [
    { iconSrc: 'assets/icons/home_icon.png', text: 'Home' },
    { iconSrc: 'assets/icons/videos_icon.png', text: 'Videos' },
    { iconSrc: 'assets/icons/category_icon.png', text: 'Categories' },
    { iconSrc: 'assets/icons/menu_icon.png', text: 'Menu' }
  ];

  categories: any[] = [];
  statuses: any[] = [];

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
    this.fetchCategories();
    this.fetchStatuses();

    // Initialize expanded state for each icon
    this.iconsData.forEach(iconData => {
      this.expandedIcons.set(iconData.text, false); // Set to false to keep them closed at the start
    });
  }

  fetchCategories(): void {
    const bearerToken = this.cookieService.get('refreshToken');
    const headers = {
      'Authorization': 'Bearer ' + bearerToken
    };

    axios.get('http://nikstep.com.ua:8085/category/all-category', { headers })
      .then(response => {
        this.categories = response.data;
      })
      .catch(error => {
        console.error('Error fetching categories', error);
      });
  }

  fetchStatuses(): void {
    const bearerToken = this.cookieService.get('refreshToken');
    const headers = {
      'Authorization': 'Bearer ' + bearerToken
    };

    axios.get('http://nikstep.com.ua:8085/access/all-status', { headers })
      .then(response => {
        this.statuses = response.data;
      })
      .catch(error => {
        console.error('Error fetching statuses', error);
      });
  }

  onFileSelected(event: any): void {
    // Handle file selection
    this.video.file = event.target.files[0];
  }

  async onSubmit(videoForm: NgForm): Promise<void> {
    try {
      // Handle any additional logic here
      const serverhost = "http://nikstep.com.ua:8085";
      const formData = new FormData();
      formData.append('title', this.video.title); 
      formData.append('description', this.video.description);
      formData.append('categoryId', this.video.categoryId.toString()); // Use the selected categoryId
      formData.append('accessStatusId', this.video.accessStatusId.toString()); // Use the selected accessStatusId

      console.log("Description!");
      console.log(this.video.description);
      console.log("Category!");
      console.log(this.video.categoryId.toString());
      console.log("this.video.accessStatusId.toString()!");
      console.log(this.video.accessStatusId.toString());
  
      // Check if file is selected before appending
        const downloadURL = await this.addDate();
        console.log("passed");
        formData.append("link_video", downloadURL);
  
      // Set up headers
      const bearerToken = this.cookieService.get('refreshToken');
      const headers = {
        'Authorization': 'Bearer ' + bearerToken,
        'Accept': '*/*',
        'Access-Control-Allow-Origin': '*',
      };
  
      // Make the POST request
      const response = await axios.post('http://nikstep.com.ua:8085/video/upload', formData, { headers });
      console.log('Success', response.data);
      // Handle success
      
      // Prevent default form submission
      videoForm.resetForm();
    } catch (error) {
      console.error('Error', error);
      // Handle error
    }
  }
  chooseFile(event: any){
    this.file = event.target.files[0];
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
  addDate(): Promise<string> {
    const storageRef: AngularFireStorageReference = this.storage.ref(this.file.name);
    const uploadTask: AngularFireUploadTask = storageRef.put(this.file);
  
    return new Promise<string>((resolve, reject) => {
      uploadTask.percentageChanges().subscribe((percentage) => {
        this.uploadProgress = percentage || 0; // Use 0 if percentage is undefined
        console.log("Upload progress:", percentage + "%");
      });
  
      uploadTask.then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          this.uploadCompleted = true; // Set uploadCompleted to true when upload is completed
          
          setTimeout(() => {
            this.uploadCompleted = false; // Hide the popup after a delay
          }, 3000); // Adjust the delay as needed (in milliseconds)
          console.log("RETURNED");
          resolve(downloadURL); // Resolve the promise with the download URL
        }).catch((error) => {
          console.error("Error getting download URL:", error);
          reject(error); // Reject the promise if an error occurs
        });
      }).catch((error) => {
        console.error("Error uploading file:", error);
        reject(error); // Reject the promise if an error occurs
      });
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
  navigateToRoute(routePath: string) {
    this.router.navigate([routePath]);
  }
  toggleIcon(iconName: string): void {
    // Toggle the expanded state for the clicked icon
    this.expandedIcons.set(iconName, !this.expandedIcons.get(iconName));
  }
}