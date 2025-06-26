const { spawn } = require('child_process');
const path = require('path');

console.log('Démarrage du serveur backend...');

// Utiliser ts-node pour exécuter directement le fichier TypeScript
const server = spawn('npx', ['ts-node', 'src/index.ts'], {
  cwd: __dirname,
  stdio: 'inherit', // Rediriger stdout et stderr vers le processus parent
  env: { ...process.env, DEBUG: 'express:*' } // Activer les logs de debug pour Express
});

server.on('error', (error) => {
  console.error('Erreur lors du démarrage du serveur:', error);
});

// Gérer la sortie propre du processus
process.on('SIGINT', () => {
  console.log('Arrêt du serveur...');
  server.kill('SIGINT');
  process.exit(0);
});
