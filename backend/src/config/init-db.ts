import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  try {
    console.log('Initialisation de la base de données...');
    
    // Lire le fichier SQL
    const sqlFilePath = path.join(__dirname, 'database.sql');
    const sqlQueries = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Exécuter les requêtes SQL
    await pool.query(sqlQueries);
    
    console.log('Base de données initialisée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

initializeDatabase();
