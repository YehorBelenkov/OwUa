import { Component } from '@angular/core';
import axios from 'axios';

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

  onSubmit(): void {
    const formData = new FormData();
    formData.append('title', this.video.title);
    formData.append('description', this.video.description);
    formData.append('categoryId', "2");
    formData.append('accessStatusId', "1");
    // Check if file is selected before appending
    if (this.video.file !== null) {
      formData.append('file', this.video.file);
    }
  
    axios.post('http://localhost:8085/video/uploadNew', formData)
      .then(response => {
        console.log('Success', response);
        // Handle success
      })
      .catch(error => {
        console.error('Error', error);
        // Handle error
      });
  }
}