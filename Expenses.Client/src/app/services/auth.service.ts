import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/authresponse';
import { RedirectCommand, Router, MaybeAsync, GuardResult } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7234/api/Auth';
  // see this for more info on BehaviorSubject and example: https://chatgpt.com/share/69c2b5ad-cce8-8002-8218-5c0d45b97c45 and https://angular.love/behaviorsubject-rxjs-reference
  private currentUserSubject = new BehaviorSubject<string | null>(null); // for setting and updating this variable will be used as a shared state to store the current user's token and allow other components to subscribe to it and react to changes in the authentication state. It is initialized with null, indicating that there is no authenticated user when the service is first created. When a user logs in or registers successfully, the token is stored in local storage and the currentUserSubject is updated with the new token, allowing any subscribed components to react to the change in authentication state.
  currentUser$ = this.currentUserSubject.asObservable(); // this will be used in header component with async pipe to get the value of currentUserSubject.

  constructor(private http: HttpClient, private router: Router) { 
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUserSubject.next(token); // update the current user subject with the token if it exists in local storage when the service is initialized
    }
  }

  login(credentials: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Login`, credentials)
    .pipe(
      tap((response) => { // tap operatpr works like forEach and allows us to perform side effects without modifying the response
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.token); // update the current user subject with the new token when the user logs in
      }))
  }

  register(credentials: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Register`, credentials)
    .pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.token); // update the current user subject with the new token when the user registers
      }))
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null); // update the current user subject to null when the user logs out
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
}
}
