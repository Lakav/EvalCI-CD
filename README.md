# Eval CI/CD

## Description du Projet

Angular 19 Todo App est une application complète de gestion de tâches avec authentification utilisateur. L'application est construite avec une architecture moderne en trois parties distinctes :

1. **Frontend** : Application Angular 19 avec interface utilisateur moderne et réactive
2. **Backend** : API RESTful Node.js/TypeScript avec authentification JWT
3. **Database** : Base de données PostgreSQL pour le stockage persistant des données

L'ensemble du projet est conteneurisé avec Docker et orchestré via Docker Compose pour un déploiement facile et cohérent.

## Architecture du Projet

```
Angular-19-Todo-App/
├── frontend/          # Application Angular 19
├── backend/           # API Node.js/TypeScript
├── database/          # Configuration PostgreSQL et scripts d'initialisation
└── docker-compose.yml # Orchestration des services
```

## Fonctionnalités

### Utilisateurs
- Inscription et création de compte
- Connexion sécurisée avec JWT
- Gestion de profil utilisateur
- Déconnexion

### Tâches (Todo)
- Création de nouvelles tâches
- Affichage de la liste des tâches
- Modification des tâches existantes
- Marquage des tâches comme complétées
- Suppression des tâches

## Technologies Utilisées

### Frontend
- Angular 19
- TypeScript
- HTML/CSS
- NGINX (pour servir l'application en production)

### Backend
- Node.js
- TypeScript
- Express.js
- JWT pour l'authentification
- Architecture MVC

### Base de données
- PostgreSQL
- Tables relationnelles (users, tasks)

### DevOps
- Docker
- Docker Compose
- Scripts d'initialisation de base de données

## Prérequis

- Docker et Docker Compose installés sur votre machine
- Git pour cloner le dépôt

## Installation et Démarrage

### Cloner le dépôt

```bash
git clone <URL_DU_REPO>
cd Angular-19-Todo-App
```

### Démarrer l'application avec Docker Compose

```bash
docker-compose up -d
```

Cette commande va :
1. Construire les images Docker pour le frontend, le backend et la base de données
2. Créer et démarrer les conteneurs
3. Configurer le réseau entre les services
4. Initialiser la base de données avec les tables nécessaires

### Accéder à l'application

- **Frontend** : http://localhost:4200
- **API Backend** : http://localhost:3002
- **Base de données** : accessible sur le port 5432

## Structure Détaillée

### Frontend (Angular 19)

L'application Angular est organisée selon les meilleures pratiques :

- **Components** : Composants réutilisables pour l'interface utilisateur
- **Services** : Logique métier et communication avec l'API
- **Models** : Interfaces TypeScript pour les données
- **Guards** : Protection des routes nécessitant une authentification

### Backend (Node.js/TypeScript)

L'API suit une architecture MVC :

- **Models** : Définition des modèles de données
- **Controllers** : Logique de traitement des requêtes
- **Routes** : Définition des endpoints de l'API
- **Middleware** : Authentification JWT et validation des requêtes

### Base de données (PostgreSQL)

La base de données contient deux tables principales :

- **users** : Stockage des informations utilisateur
  - id, nom, prenom, email, password, created_at
- **tasks** : Stockage des tâches liées aux utilisateurs
  - id, title, description, completed, user_id, created_at, updated_at

## API Endpoints

### Authentification
- `POST /api/auth/register` : Inscription d'un nouvel utilisateur
- `POST /api/auth/login` : Connexion utilisateur et génération de token JWT

### Utilisateurs
- `GET /api/users/profile` : Récupérer le profil de l'utilisateur connecté
- `PUT /api/users/profile` : Mettre à jour le profil utilisateur
- `DELETE /api/users` : Supprimer le compte utilisateur

### Tâches
- `GET /api/tasks` : Récupérer toutes les tâches de l'utilisateur connecté
- `POST /api/tasks` : Créer une nouvelle tâche
- `GET /api/tasks/:id` : Récupérer une tâche spécifique
- `PUT /api/tasks/:id` : Mettre à jour une tâche
- `DELETE /api/tasks/:id` : Supprimer une tâche

## Commandes Docker Utiles

### Gestion des conteneurs

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Voir les logs
docker-compose logs

# Suivre les logs en temps réel
docker-compose logs -f

# Redémarrer un service spécifique
docker-compose restart frontend
```

### Accès à la base de données

```bash
# Se connecter à la base de données PostgreSQL
docker exec -it angular-19-todo-app-database-1 psql -U postgres -d todo_app

# Lister les tables
\dt

# Voir la structure d'une table
\d users
\d tasks

# Exécuter une requête SQL
SELECT * FROM users;
SELECT * FROM tasks;
```

## Développement

### Modification du Frontend

Si vous modifiez le code frontend, vous devez reconstruire l'image Docker :

```bash
docker-compose up -d --build frontend
```

### Modification du Backend

Si vous modifiez le code backend, vous devez reconstruire l'image Docker :

```bash
docker-compose up -d --build backend
```

## Sécurité

- Les mots de passe sont hashés avec bcrypt avant d'être stockés
- L'authentification utilise des tokens JWT avec expiration
- Les requêtes API sont protégées par middleware d'authentification
- Les variables d'environnement sensibles sont gérées via Docker Compose

## Dépannage

### Problèmes de connexion à la base de données

Vérifiez que le service de base de données est bien démarré :

```bash
docker-compose ps database
```

Vérifiez les logs de la base de données :

```bash
docker-compose logs database
```

### Problèmes avec le frontend

Vérifiez que le service frontend est bien démarré :

```bash
docker-compose ps frontend
```

Vérifiez les logs du frontend :

```bash
docker-compose logs frontend
```

### Problèmes avec le backend

Vérifiez que le service backend est bien démarré :

```bash
docker-compose ps backend
```

Vérifiez les logs du backend :

```bash
docker-compose logs backend
```