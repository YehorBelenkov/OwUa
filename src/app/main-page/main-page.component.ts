import { Component } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  public file: any = {};
  public uploadProgress: number = 0;
  public uploadCompleted: boolean = false; // Add this variable

  constructor(private storage: AngularFireStorage) { }

  chooseFile(event: any){
    this.file = event.target.files[0];
  }

  addDate(){
    const storageRef: AngularFireStorageReference = this.storage.ref(this.file.name);
    const uploadTask: AngularFireUploadTask = storageRef.put(this.file);

    uploadTask.percentageChanges().subscribe((percentage) => {
      this.uploadProgress = percentage || 0; // Use 0 if percentage is undefined
    });

    uploadTask.then((snapshot) => {
      snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("File available at", downloadURL);
        this.uploadCompleted = true; // Set uploadCompleted to true when upload is completed
        setTimeout(() => {
          this.uploadCompleted = false; // Hide the popup after a delay
        }, 3000); // Adjust the delay as needed (in milliseconds)
      });
    });
  }
}