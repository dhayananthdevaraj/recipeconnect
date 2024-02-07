import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    localStorage.clear();
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .subscribe(
          (response: any) => {

            if (response.status === 200) {

              if (response.body.message === "Invalid Credentials") {
                let passwordControl = this.loginForm.get('password');
                if (passwordControl) {
                  passwordControl.setErrors({ 'manual': 'Invalid Email or Password' });
                }
              } else {
                const user = response.body;
                console.log("response.data", response.body);
                localStorage.setItem("token", response.body.token);

                const userData = {
                  role: user.role,
                  userId: user.userId,
                  userName: user.username,
                };



                localStorage.setItem("userData", JSON.stringify(userData));

                if (user.role === "seller") {
                  this.router.navigate(['/usertask']);
                } else {
                  this.router.navigate(['/displaytask']);
                }
              }
            }
          },
          (error) => {
            this.router.navigate(['/error']);
          }
        );
    }
  }
}
