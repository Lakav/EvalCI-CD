import pool from '../config/db';
import bcrypt from 'bcrypt';

export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  created_at?: Date;
}

export class UserModel {
  // Créer un nouvel utilisateur
  async create(user: User): Promise<User> {
    const { nom, prenom, email, password } = user;
    
    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO users (nom, prenom, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nom, prenom, email, created_at
    `;
    
    const values = [nom, prenom, email, hashedPassword];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  }
  
  // Trouver un utilisateur par email
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    
    return result.rows[0] || null;
  }
  
  // Trouver un utilisateur par ID
  async findById(id: number): Promise<User | null> {
    const query = 'SELECT id, nom, prenom, email, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    return result.rows[0] || null;
  }
  
  // Mettre à jour un utilisateur
  async update(id: number, user: Partial<User>): Promise<User | null> {
    const { nom, prenom, email, password } = user;
    let hashedPassword = password;
    
    // Si le mot de passe est fourni, le hacher
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
    
    // Construire la requête dynamiquement en fonction des champs fournis
    let query = 'UPDATE users SET ';
    const values: any[] = [];
    const updateFields: string[] = [];
    
    let paramIndex = 1;
    
    if (nom) {
      updateFields.push(`nom = $${paramIndex++}`);
      values.push(nom);
    }
    
    if (prenom) {
      updateFields.push(`prenom = $${paramIndex++}`);
      values.push(prenom);
    }
    
    if (email) {
      updateFields.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    
    if (hashedPassword) {
      updateFields.push(`password = $${paramIndex++}`);
      values.push(hashedPassword);
    }
    
    if (updateFields.length === 0) {
      return this.findById(id);
    }
    
    query += updateFields.join(', ');
    query += ` WHERE id = $${paramIndex} RETURNING id, nom, prenom, email, created_at`;
    values.push(id);
    
    const result = await pool.query(query, values);
    
    return result.rows[0] || null;
  }
  
  // Supprimer un utilisateur
  async delete(userId: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await pool.query(query, [userId]);
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Lister tous les utilisateurs
  async findAll(): Promise<User[]> {
    const query = 'SELECT id, nom, prenom, email, created_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    
    return result.rows;
  }
}
