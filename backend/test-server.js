// Importer l'application Express compilée
const app = require('./dist/index.js');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Définir le port
const PORT = process.env.PORT || 3002;

// Démarrer le serveur Express
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Gérer les erreurs
server.on('error', (error) => {
  console.error('Erreur lors du démarrage du serveur:', error);
});
