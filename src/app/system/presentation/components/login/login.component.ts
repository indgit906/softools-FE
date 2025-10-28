import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../data/services/auth.service';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../../data/services/admin';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: any;
  apiUrl = environment.API;
  http = inject(HttpClient);
  router = inject(Router);
  adminService = inject(AdminService);
  authService = inject(AuthService);
  role = '';
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }
  getEmail = () => {
    return this.loginForm.controls['email'];
  };
  getPassword() {
    return this.loginForm.controls['password '];
  }
  email = '';
  password = '';

  onLogin() {
    this.authService.role = this.role = '';
    const { email, password } = this.loginForm.value;
    //this.adminService.setData(email);
    //this.authService.login(email);
    this.authService.apiLogin(email, password).subscribe({
      next: (data: any) => {
        localStorage.setItem('token', data.token);
        // console.log(data.token);
        this.authService.loggedInSubject.next(true);
        this.router.navigateByUrl('app/admin');
        // this.authService.isLoggedIn()
        //   ? this.router.navigateByUrl('app/admin')
        //   : this.router.navigateByUrl('/app/home');
      },
      error: (err) => {
        alert(`loggedIn Failed ${err}`);
        this.router.navigateByUrl('/app/home');
      },
    });
  }
}
