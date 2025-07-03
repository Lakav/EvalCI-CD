import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
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

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    // Réinitialiser les messages
    this.errorMessage = '';
    this.successMessage = '';
    
    // Validation des champs
    if (!this.nom || !this.prenom || !this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.cdr.detectChanges();
      return;
    }
    
    // Appel à l'API d'inscription
    this.http.post<any>('http://localhost:3002/api/users/register', {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        // Inscription réussie
        this.successMessage = 'Inscription réussie ! Vous pouvez vous connecter.';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/user']), 1500);
      },
      error: (err: any) => {
        // Définir un message d'erreur par défaut
        this.errorMessage = 'Erreur lors de l\'inscription';
        
        // Messages d'erreur spécifiques
        if (err.status === 400) {
          if (err.error?.message?.includes('email est déjà utilisé')) {
            this.errorMessage = 'Cet email est déjà utilisé. Veuillez en choisir un autre.';
          } else {
            this.errorMessage = 'Tous les champs sont requis';
          }
        }
        
        // Forcer la détection de changements
        this.cdr.detectChanges();
      }
    });
  }
}