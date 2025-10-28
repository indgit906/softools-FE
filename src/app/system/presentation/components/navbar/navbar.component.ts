import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../data/services/auth.service';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  authService = inject(AuthService);
  token = localStorage.getItem('token');
  router = inject(Router);
  openWhatsApp() {
    this.authService.openWhatsApp();
  }
  navigateTo(view: 'orders' | 'products' | 'edit') {
    this.authService.switchView(view);
  }

  logout() {
    if (this.authService.logout().valueOf()) {
      this.router.navigateByUrl('/app/home');
    }
  }

  isLoggedIn(): boolean {
    // if (this.token != null) return this.authService.loggedInSubject.value;
    // return true
    return this.authService.loggedInSubject.value;
  }
}
