import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';

console.log('Démarrage du serveur...');

// Charger les variables d'environnement
try {
  dotenv.config();
  console.log('Variables d\'environnement chargées');
  console.log('PORT:', process.env.PORT);
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Défini' : 'Non défini');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Défini' : 'Non défini');
} catch (error) {
  console.error('Erreur lors du chargement des variables d\'environnement:', error);
}

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 3002;
console.log('Application Express initialisée, port:', PORT);

// Middleware
try {
  app.use(cors());
  app.use(express.json());
  console.log('Middleware configuré');
} catch (error) {
  console.error('Erreur lors de la configuration du middleware:', error);
}

// Routes
try {
  app.use('/api/users', userRoutes);
  app.use('/api/tasks', taskRoutes);
  console.log('Routes configurées');
} catch (error) {
  console.error('Erreur lors de la configuration des routes:', error);
}

// Route de base
app.get('/', (req, res) => {
  console.log('Requête reçue sur la route racine');
  res.send('API Todo App - Backend fonctionne correctement');
});

// Démarrer le serveur si ce fichier est exécuté directement
if (require.main === module) {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
    
    server.on('error', (error) => {
      console.error('Erreur lors du démarrage du serveur:', error);
    });
  } catch (error) {
    console.error('Exception lors du démarrage du serveur:', error);
  }
}

// Exporter l'application pour pouvoir l'utiliser dans d'autres fichiers
export default app;
module.exports = app;
