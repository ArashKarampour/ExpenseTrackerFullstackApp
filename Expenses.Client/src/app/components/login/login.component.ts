import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      }
      );
    }

    hasError(controlName: string, errorName: string): boolean {
      const control = this.loginForm.get(controlName);
      return control ? (control.dirty || control.touched) && control.hasError(errorName)  : false;
    }
    
    onSubmit() {

      this.errorMessage = null; // reset error message on new submission

      if(this.loginForm.valid){
        const loginData = this.loginForm.value;
        this.authService.login(loginData)
        .subscribe({
          next: () =>{
            this.router.navigate(['/transactions']);
          },
          error: (err) => {
            console.log(`Error while logging in ${err}`);
            this.errorMessage = err.error?.message || 'An error occurred during login. Please try again.';
          }
        });
      }
    }
}
