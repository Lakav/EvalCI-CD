import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {
  nom = '';
  prenom = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.http.post<any>('http://localhost:3002/api/users/register', {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie ! Vous pouvez vous connecter.';
        setTimeout(() => this.router.navigate(['/user']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }
}