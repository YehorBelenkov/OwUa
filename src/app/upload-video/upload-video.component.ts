import { Component } from '@angular/core';
import axios from 'axios';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css']
})
export class UploadVideoComponent {

  video = {
    title: '',
    description: '',
    file: null
  };

  onFileSelected(event: any): void {
    // Handle file selection
    this.video.file = event.target.files[0];
  }

  onSubmit(videoForm: NgForm): void {
    // Handle any additional logic here
    
    const formData = new FormData();
    formData.append('title', this.video.title);
    formData.append('description', this.video.description);
    formData.append('categoryId', "2");
    formData.append('accessStatusId', "1");
  
    // Check if file is selected before appending
    if (this.video.file !== null) {
      formData.append('file', this.video.file);
    }

    // Set up headers
    const headers = {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMUBtYWlsLmNvbSIsImlhdCI6MTcwNTQzNzg2MSwiZXhwIjoxNzA1NTI0MjYxfQ.-GyGkaZl6Ncm_Q-FY_5OM6sHljnPsrQy7RU4ono0j_E',
      
      // 'Content-Length': '<calculated when request is sent>',
      // 'Host': '<calculated when request is sent>',
      // 'User-Agent': '',
      'Accept': '*/*',
      // 'Accept-Encoding': 'gzip, deflate, br',
      // 'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      // Add other headers as needed
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