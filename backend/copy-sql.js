const fs = require('fs');
const path = require('path');

// Créer le dossier dist/config s'il n'existe pas
const configDir = path.join(__dirname, 'dist', 'config');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// Copier le fichier SQL
const sourcePath = path.join(__dirname, 'src', 'config', 'database.sql');
const destPath = path.join(__dirname, 'dist', 'config', 'database.sql');

try {
  fs.copyFileSync(sourcePath, destPath);
  console.log('Fichier SQL copié avec succès dans le dossier dist/config');
} catch (error) {
  console.error('Erreur lors de la copie du fichier SQL:', error);
  process.exit(1);
}
