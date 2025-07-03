import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    // Réinitialiser le message d'erreur
    this.errorMessage = '';
    
    // Validation des champs
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }
    
    // Appel à l'API de connexion
    this.http.post<any>('http://localhost:3002/api/users/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: { token: string }) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.log('Erreur de connexion:', err);
        
        // Utiliser setTimeout pour s'assurer que le message est mis à jour après le cycle de détection
        setTimeout(() => {
          // Définir un message d'erreur par défaut
          this.errorMessage = 'Erreur de connexion';
          
          // Afficher un message d'erreur spécifique selon le code d'erreur
          if (err.status === 401) {
            this.errorMessage = 'Identifiants incorrects';
          } else if (err.status === 400) {
            this.errorMessage = 'Email et mot de passe requis';
          }
          
          console.log('Message d\'erreur défini:', this.errorMessage);
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }
}