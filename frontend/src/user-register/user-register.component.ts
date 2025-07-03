import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
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
  
  // Variables pour les erreurs de validation
  nomError = '';
  prenomError = '';
  emailError = '';
  passwordError = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  // Méthode pour valider l'email avec une expression régulière
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  
  // Méthode pour réinitialiser tous les messages d'erreur
  resetErrors() {
    this.nomError = '';
    this.prenomError = '';
    this.emailError = '';
    this.passwordError = '';
    this.errorMessage = '';
    this.successMessage = '';
  }
  
  // Méthode pour valider le formulaire
  validateForm(): boolean {
    let isValid = true;
    this.resetErrors();
    
    // Validation du nom
    if (!this.nom.trim()) {
      this.nomError = 'Le nom est requis';
      isValid = false;
    }
    
    // Validation du prénom
    if (!this.prenom.trim()) {
      this.prenomError = 'Le prénom est requis';
      isValid = false;
    }
    
    // Validation de l'email
    if (!this.email.trim()) {
      this.emailError = 'L\'email est requis';
      isValid = false;
    } else if (!this.validateEmail(this.email)) {
      this.emailError = 'Format d\'email invalide';
      isValid = false;
    }
    
    // Validation du mot de passe
    if (!this.password) {
      this.passwordError = 'Le mot de passe est requis';
      isValid = false;
    } else if (this.password.length < 5) {
      this.passwordError = 'Le mot de passe doit contenir au moins 5 caractères';
      isValid = false;
    }
    
    return isValid;
  }
  
  onSubmit() {
    // Réinitialiser les messages généraux
    this.errorMessage = '';
    this.successMessage = '';
    
    // Validation du formulaire
    if (!this.validateForm()) {
      // Si le formulaire n'est pas valide, on affiche un message général
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
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