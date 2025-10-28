import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    const token = localStorage.getItem('token');

    if (token == null) {
      this.router.navigateByUrl('app/home');
      return false;
    } else {
      return true;
    }
  }
}
