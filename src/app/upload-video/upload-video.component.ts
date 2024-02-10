import { Component } from '@angular/core';
import axios from 'axios';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css']
})
export class UploadVideoComponent {
  public file: any = {};
  public uploadProgress: number = 0;
  public uploadCompleted: boolean = false; // Add this variable

  constructor(private cookieService: CookieService, private storage: AngularFireStorage) {}

  video = {
    title: '',
    description: '',
    file: null as HTMLInputElement | null,
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

  async onSubmit(videoForm: NgForm): Promise<void> {
    try {
      // Handle any additional logic here
      const serverhost = "http://10.0.0.151:8085";
      const formData = new FormData();
      formData.append('title', this.video.title); 
      formData.append('description', this.video.description);
      formData.append('categoryId', this.video.categoryId.toString()); // Use the selected categoryId
      formData.append('accessStatusId', this.video.accessStatusId.toString()); // Use the selected accessStatusId
  
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
      const response = await axios.post('http://localhost:8085/video/uploadNew', formData, { headers });
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
}