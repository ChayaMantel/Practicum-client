import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  
  login(identity: string, lastName: string) {
    const credentials = { identity: identity, lastName: lastName };
    return this.http.post<any>('http://localhost:5176/api/Auth', credentials);
  }
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
}
