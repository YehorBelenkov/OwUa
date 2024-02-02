import { Component } from '@angular/core';
import axios from 'axios';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css']
})
export class UploadVideoComponent {
  constructor(private cookieService: CookieService) {}

  video = {
    title: '',
    description: '',
    file: null,
    categoryId: 0, // Add this line
    accessStatusId: 0 // Add this line
  };

  categories: any[] = [];
  statuses: any[] = [];

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchStatuses();
  }

  fetchCategories(): void {
    const bearerToken = this.cookieService.get('refreshToken');
    const headers = {
      'Authorization': 'Bearer ' + bearerToken
    };

    axios.get('http://localhost:8085/category/all-category', { headers })
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

    axios.get('http://localhost:8085/access/all-status', { headers })
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

  onSubmit(videoForm: NgForm): void {
    // Handle any additional logic here
  
    const serverhost = "http://10.0.0.151:8085";
    const formData = new FormData();
    formData.append('title', this.video.title);
    formData.append('description', this.video.description);
    formData.append('categoryId', this.video.categoryId.toString()); // Use the selected categoryId
    formData.append('accessStatusId', this.video.accessStatusId.toString()); // Use the selected accessStatusId
    
    // Check if file is selected before appending
    if (this.video.file !== null) {
      formData.append('file', this.video.file);
    }
  
    // Set up headers
    const bearerToken = this.cookieService.get('refreshToken');
    const headers = {
      'Authorization': 'Bearer ' + bearerToken,
      'Accept': '*/*',
      'Access-Control-Allow-Origin': '*',
    };
  
    axios.post('http://localhost:8085/video/uploadNew', formData, { headers })
      .then(response => {
        console.log('Success', response);
        // Handle success
      })
      .catch(error => {
        console.error('Error', error);
        // Handle error
      });
  
    // Prevent default form submission
    videoForm.resetForm();
  }
}