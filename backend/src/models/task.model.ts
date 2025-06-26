import pool from '../config/db';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  completed?: boolean;
  user_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export class TaskModel {
  // Créer une nouvelle tâche
  async create(task: Task): Promise<Task> {
    const { title, description, completed, user_id } = task;
    
    const query = `
      INSERT INTO tasks (title, description, completed, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [title, description || null, completed || false, user_id];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  }
  
  // Trouver une tâche par ID
  async findById(id: number): Promise<Task | null> {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    return result.rows[0] || null;
  }
  
  // Trouver toutes les tâches d'un utilisateur
  async findByUserId(userId: number): Promise<Task[]> {
    const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    
    return result.rows;
  }
  
  // Mettre à jour une tâche
  async update(id: number, task: Partial<Task>): Promise<Task | null> {
    const { title, description, completed } = task;
    
    // Construire la requête dynamiquement en fonction des champs fournis
    let query = 'UPDATE tasks SET updated_at = CURRENT_TIMESTAMP';
    const values: any[] = [];
    let paramIndex = 1;
    
    if (title !== undefined) {
      query += `, title = $${paramIndex++}`;
      values.push(title);
    }
    
    if (description !== undefined) {
      query += `, description = $${paramIndex++}`;
      values.push(description);
    }
    
    if (completed !== undefined) {
      query += `, completed = $${paramIndex++}`;
      values.push(completed);
    }
    
    query += ` WHERE id = $${paramIndex} RETURNING *`;
    values.push(id);
    
    const result = await pool.query(query, values);
    
    return result.rows[0] || null;
  }
  
  // Supprimer une tâche
  async delete(taskId: number): Promise<boolean> {
    const query = 'DELETE FROM tasks WHERE id = $1';
    const result = await pool.query(query, [taskId]);
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Lister toutes les tâches
  async findAll(): Promise<Task[]> {
    const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
    const result = await pool.query(query);
    
    return result.rows;
  }
}
