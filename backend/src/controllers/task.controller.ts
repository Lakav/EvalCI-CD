import { Request, Response } from 'express';
import { TaskModel, Task } from '../models/task.model';

const taskModel = new TaskModel();

export class TaskController {
  // Créer une nouvelle tâche
  async createTask(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { title, description, completed } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
      
      if (!title) {
        return res.status(400).json({ message: 'Le titre est requis' });
      }
      
      const newTask = await taskModel.create({
        title,
        description,
        completed,
        user_id: userId
      });
      
      res.status(201).json({
        message: 'Tâche créée avec succès',
        task: newTask
      });
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
  
  // Obtenir toutes les tâches de l'utilisateur connecté
  async getUserTasks(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
      
      const tasks = await taskModel.findByUserId(userId);
      
      res.status(200).json({ tasks });
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
  
  // Obtenir une tâche spécifique
  async getTaskById(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const taskId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
      
      if (isNaN(taskId)) {
        return res.status(400).json({ message: 'ID de tâche invalide' });
      }
      
      const task = await taskModel.findById(taskId);
      
      if (!task) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
      
      // Vérifier que la tâche appartient à l'utilisateur connecté
      if (task.user_id !== userId) {
        return res.status(403).json({ message: 'Accès non autorisé à cette tâche' });
      }
      
      res.status(200).json({ task });
    } catch (error) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
  
  // Mettre à jour une tâche
  async updateTask(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const taskId = parseInt(req.params.id);
      const { title, description, completed } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
      
      if (isNaN(taskId)) {
        return res.status(400).json({ message: 'ID de tâche invalide' });
      }
      
      // Vérifier que la tâche existe
      const existingTask = await taskModel.findById(taskId);
      
      if (!existingTask) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
      
      // Vérifier que la tâche appartient à l'utilisateur connecté
      if (existingTask.user_id !== userId) {
        return res.status(403).json({ message: 'Accès non autorisé à cette tâche' });
      }
      
      // Mettre à jour la tâche
      const updatedTask = await taskModel.update(taskId, {
        title,
        description,
        completed
      });
      
      res.status(200).json({
        message: 'Tâche mise à jour avec succès',
        task: updatedTask
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
  
  // Supprimer une tâche
  async deleteTask(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const taskId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
      
      if (isNaN(taskId)) {
        return res.status(400).json({ message: 'ID de tâche invalide' });
      }
      
      // Vérifier que la tâche existe
      const existingTask = await taskModel.findById(taskId);
      
      if (!existingTask) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
      
      // Vérifier que la tâche appartient à l'utilisateur connecté
      if (existingTask.user_id !== userId) {
        return res.status(403).json({ message: 'Accès non autorisé à cette tâche' });
      }
      
      // Supprimer la tâche
      await taskModel.delete(taskId);
      
      res.status(200).json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}
