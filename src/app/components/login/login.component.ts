import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule]
})

export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private router: Router, private _authService: AuthService) { }


  ngOnInit(): void {
    this.loginForm = new FormGroup({
      "lastName": new FormControl("admin", [Validators.required]),
      "identity": new FormControl("123456789", [Validators.required]),
    });
  }

  onSubmit(): void {
    const identity = this.loginForm.get('identity')!.value;
    const lastname = this.loginForm.get('lastName')!.value;
    this._authService.login(identity, lastname).subscribe(
      response => {
        const token = response.token;
        sessionStorage.setItem('token', token);
      },
      error => {
        this.errorMessage = 'Failed to login. Please try again.';
      }
    );
    sessionStorage.setItem('name', lastname);
    this.router.navigate(["/employee/all"]);
  }

}


