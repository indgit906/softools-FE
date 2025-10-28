import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: any;
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }
  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log('Form Submitted!', formData);
      // Here you can call your service to handle the registration logic
    }
  }
  firstName() {
    return this.registerForm.controls['firstName'];
  }
  lastName() {
    return this.registerForm.controls['lastName'];
  }
  email() {
    return this.registerForm.controls['email'];
  }
  password() {
    return this.registerForm.controls['password'];
  }
  confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }
}
