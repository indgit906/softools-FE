// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();
  role = '';
  private _baseUrl = environment.API;
  token: string | null = localStorage.getItem('token');

  constructor(private http: HttpClient) {}
  apiLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this._baseUrl}/auth/login`, {
      userName: email,
      password: password,
    });
  }
  login(email: string): boolean {
    if (email.toLowerCase().includes('softool')) {
      this.loggedInSubject.next(true);
      this.role = 'ADMIN';
      return true;
    }

    this.loggedInSubject.next(false);
    //this.router.navigateByUrl('/app/home');
    return false;
  }

  logout(): boolean {
    this.loggedInSubject.next(false);
    localStorage.removeItem('token');
    this.token = '';
    return false;
  }

  isLoggedIn(): boolean {
    if (this.token != null) {
      return true;
    }
    return this.loggedInSubject.value;
  }

  isAdmin(): boolean {
    return this.loggedInSubject.value && this.token != null;
  }
  // Whatsapp API

  private apiUrl: string = 'https://wa.me/917019881960?';

  openWhatsApp() {
    window.open(this.apiUrl, '_blank');
  }
  private currentView = new BehaviorSubject<'products' | 'orders' | 'edit'>(
    'orders'
  );
  view$ = this.currentView.asObservable();

  switchView(view: 'products' | 'orders' | 'edit') {
    this.currentView.next(view);
  }
}
