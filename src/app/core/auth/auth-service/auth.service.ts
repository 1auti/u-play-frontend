import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { identifierName } from '@angular/compiler';

interface LoginResponse {
  Header: string;
  token: string;
  userData: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token = undefined;

  private apiUplayURL = 'http://localhost:8080/api/users';

  constructor (private http: HttpClient){

  }


  login(username: string, password: string): Observable<LoginResponse> {
    const url = `${this.apiUplayURL}/login`;
  
    return this.http.post<LoginResponse>(url, { username, password })
      .pipe(
        map((response) => {
          if (response && response.token) {
            console.log("Login successful.");
            const token = response.token;
  
            this.storeToken(token);
  
            if (response.userData) {
              localStorage.setItem('userData', response.userData);
              console.log(localStorage.getItem('userData'));
            }
  
            return response;
          } else {
            console.log("Login unsuccessful. Showing alert.");
            throw new Error("Login unsuccessful");
          }
        }),
        catchError((error) => {
          console.error('Error in login request:', error);
          throw error; 
        })
      );
  }
  
  storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string {

    const userData = localStorage.getItem('userData');
    let userName = 'username'
    if (userData) {
      const user = JSON.parse(userData);
      userName = user.username;
      console.log('this.username:', userName);
    }
    return userName;
  }

  getAuthorizationHeader(): HttpHeaders {
    const token = this.getToken();

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  logout(): void{
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.reload();
  }
}