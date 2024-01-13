import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css']
})
export class UploadVideoComponent {
  video = {
    title: "testing3",
    description: "tesingdesc",
    categoryId: 2,
    accessStatusId: 1,
    file: null as File | null,
  };

  constructor(private http: HttpClient) {}

  submitForm() {
    const formData = new FormData();
    formData.append('title', this.video.title);
    formData.append('description', this.video.description);
    formData.append('categoryId', this.video.categoryId.toString());
    formData.append('accessStatusId', this.video.accessStatusId.toString());
    if (this.video.file) {
      formData.append('file', this.video.file, this.video.file.name);
    }
  
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMUBtYWlsLmNvbSIsImlhdCI6MTcwNTA4Nzc3MiwiZXhwIjoxNzA1MTc0MTcyfQ.8kFfbrhW4BDkWkxWVNiuuYI7HbMdmZWmPGmzxKnWH04'; // Replace with your actual access token
    const headers = { Authorization: `Bearer ${token}` };
  
    this.http.post('http://localhost:8085/video/uploadNew', formData, { headers })
      .subscribe(
        response => {
          console.log('Video uploaded successfully!', response);
          // Reset the form after successful upload if needed
          // this.videoForm.resetForm();
        },
        error => {
          console.error('Error uploading video:', error);
        }
      );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.video.file = file;
    }
  }
}