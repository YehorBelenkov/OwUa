import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-getvideo',
  templateUrl: './getvideo.component.html',
  styleUrls: ['./getvideo.component.css']
})
export class GetvideoComponent implements OnInit {
  categories: any[] = [];
  selectedCategory: any; // Variable to store the selected category by ID
  categoryId: number | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    const apiUrl = 'http://localhost:8085/category/all-category';

    // Making the GET request using Angular's HttpClient
    this.http.get(apiUrl)
      .subscribe(
        (response: any) => {
          console.log('Success', response);
          this.categories = response; // Assigning the retrieved categories to the array
        },
        (error) => {
          console.error('Error', error);
        }
      );
  }

  fetchCategoryById() {
    if (this.categoryId !== undefined) {
      const apiUrl = `http://localhost:8085/category/${this.categoryId}`;

      // Making the GET request using Angular's HttpClient
      this.http.get(apiUrl)
        .subscribe(
          (response: any) => {
            console.log('Success', response);
            this.selectedCategory = response; 
          },
          (error) => {
            console.error('Error', error);
          }
        );
    } else {
      console.error('Category ID is undefined.');
    }
  }
}