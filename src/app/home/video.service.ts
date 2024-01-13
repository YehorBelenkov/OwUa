import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = 'http://localhost:8085/video/all';

  constructor(private http: HttpClient) {}

  getAllVideos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}