// src/app/components/registration-form/registration-form.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      role: ['seller', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(6)]],
      lastName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  handleInputChange(event: any, field: string): void {
    this.registrationForm.get(field)?.setValue(event.target.value);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  handleSubmit(): void {

    Object.keys(this.registrationForm.controls).forEach(field => {
      const control = this.registrationForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.registrationForm.valid) {
      const userData = {
        role: this.registrationForm.value.role,
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName,
        mobileNumber: this.registrationForm.value.mobileNumber,
        email: this.registrationForm.value.email,
        password: this.registrationForm.value.password,
      };

      this.authService.register(userData).subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.router.navigate(['/login']);
          }
        },
        (error) => {
          this.router.navigate(['/error']);
        }
      );
    } else {
      // Trigger validation for all fields
      for (const field in this.registrationForm.controls) {
        if (this.registrationForm.controls.hasOwnProperty(field)) {
          this.registrationForm.controls[field].markAsTouched();
        }
      }
    }
  }
}
