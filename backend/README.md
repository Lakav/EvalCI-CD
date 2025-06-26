# Backend Todo App

Backend Node.js avec TypeScript et PostgreSQL pour l'application de gestion de tâches.

## Fonctionnalités

- Authentification utilisateur (inscription, connexion avec JWT)
- Gestion des comptes utilisateurs (profil, mise à jour, suppression)
- CRUD complet pour les tâches
- API RESTful
- Base de données PostgreSQL

## Prérequis

- Node.js (v14+)
- PostgreSQL
- npm ou yarn

## Installation

1. Cloner le dépôt et naviguer vers le dossier backend :
```bash
cd backend
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
   - Renommer le fichier `.env.example` en `.env` (si nécessaire)
   - Modifier les valeurs dans le fichier `.env` selon votre configuration

4. Créer la base de données PostgreSQL :
```bash
createdb todo_app
```

5. Initialiser la base de données :
```bash
npm run build
node dist/config/init-db.js
```

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm run build
npm start
```

## Structure du projet

```
backend/
├── src/
│   ├── config/         # Configuration (DB, env)
│   ├── controllers/    # Contrôleurs
│   ├── middleware/     # Middleware (auth, validation)
│   ├── models/         # Modèles de données
│   ├── routes/         # Routes API
│   └── index.ts        # Point d'entrée
├── .env                # Variables d'environnement
└── tsconfig.json       # Configuration TypeScript
```

## API Endpoints

### Utilisateurs
- `POST /api/users/register` - Inscription
- `POST /api/users/login` - Connexion
- `GET /api/users/profile` - Obtenir le profil (authentifié)
- `PUT /api/users/profile` - Mettre à jour le profil (authentifié)
- `DELETE /api/users/account` - Supprimer le compte (authentifié)

### Tâches
- `GET /api/tasks` - Liste des tâches de l'utilisateur (authentifié)
- `GET /api/tasks/:id` - Détails d'une tâche (authentifié)
- `POST /api/tasks` - Créer une tâche (authentifié)
- `PUT /api/tasks/:id` - Mettre à jour une tâche (authentifié)
- `DELETE /api/tasks/:id` - Supprimer une tâche (authentifié)
