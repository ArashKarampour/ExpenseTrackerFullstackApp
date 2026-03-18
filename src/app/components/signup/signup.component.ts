import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signUpForm: FormGroup
  
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signUpForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: this.passwordMatchValidator // define a custom validator function name
      }
      );
    }

    // password custom validator implementation
    passwordMatchValidator(control : AbstractControl): ValidationErrors | null { // null means no error, otherwise return an object with the error name and value
      return control.get('confirmPassword')?.value == control.get('password')?.value ? null : { passwordMismatch: true };
    }
    
    onSubmit() {
      if(this.signUpForm.valid){
        const signupData = this.signUpForm.value;
        this.authService.register(signupData)
        .subscribe({
          next: () =>{
            this.router.navigate(['/transactions']);
          },
          error: (err) => {
            console.log(`Error while signing up ${err}`);
          }
        });
      }
    }
    
    
}
