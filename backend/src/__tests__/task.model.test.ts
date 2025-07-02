// Définir les mocks avant d'importer les modules
const mockQuery = jest.fn();

// Mock de la connexion à la base de données
jest.mock('../config/db', () => ({
  __esModule: true,
  default: {
    query: mockQuery
  }
}));

// Importer les modules après les mocks
import { TaskModel, Task } from '../models/task.model';
import pool from '../config/db';

describe('TaskModel', () => {
  let taskModel: TaskModel;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    mockQuery.mockReset();
    
    // Créer une instance du modèle
    taskModel = new TaskModel();
  });

  describe('create', () => {
    it('devrait créer une nouvelle tâche', async () => {
      // Arrange
      const taskData: Task = {
        title: 'Nouvelle tâche',
        description: 'Description de la tâche',
        completed: false,
        user_id: 1
      };
      
      const mockResult = {
        rows: [{
          id: 1,
          ...taskData,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await taskModel.create(taskData);
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO tasks'),
        [taskData.title, taskData.description, taskData.completed, taskData.user_id]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findById', () => {
    it('devrait trouver une tâche par ID', async () => {
      // Arrange
      const taskId = 1;
      const mockTask = {
        id: taskId,
        title: 'Tâche existante',
        description: 'Description',
        completed: false,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const mockResult = {
        rows: [mockTask]
      };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await taskModel.findById(taskId);
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE id = $1',
        [taskId]
      );
      expect(result).toEqual(mockTask);
    });

    it('devrait retourner null si la tâche n\'existe pas', async () => {
      // Arrange
      const taskId = 999;
      const mockResult = { rows: [] };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await taskModel.findById(taskId);
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE id = $1',
        [taskId]
      );
      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('devrait trouver toutes les tâches d\'un utilisateur', async () => {
      // Arrange
      const userId = 1;
      const mockTasks = [{
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }];
      
      const mockResult = { rows: mockTasks };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await taskModel.findByUserId(userId);
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      expect(result).toEqual(mockTasks);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une tâche', async () => {
      // Arrange
      const taskId = 1;
      const updateData = {
        title: 'Titre mis à jour',
        description: 'Description mise à jour',
        completed: true
      };
      
      const mockUpdatedTask = {
        id: taskId,
        ...updateData,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const mockResult = { rows: [mockUpdatedTask] };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await taskModel.update(taskId, updateData);
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE tasks SET'),
        expect.arrayContaining([updateData.title, updateData.description, updateData.completed, taskId])
      );
      expect(result).toEqual(mockUpdatedTask);
    });
  });

  describe('delete', () => {
    it('devrait supprimer une tâche', async () => {
      // Arrange
      const taskId = 1;
      const mockResult = { rowCount: 1 };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await taskModel.delete(taskId);
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM tasks WHERE id = $1',
        [taskId]
      );
      expect(result).toBe(true);
    });

    it('devrait retourner false si la tâche n\'existe pas', async () => {
      // Arrange
      const taskId = 999;
      const mockResult = { rowCount: 0 };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await taskModel.delete(taskId);
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM tasks WHERE id = $1',
        [taskId]
      );
      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('devrait récupérer toutes les tâches', async () => {
      // Arrange
      const mockTasks = [
        { id: 1, title: 'Tâche 1', user_id: 1 },
        { id: 2, title: 'Tâche 2', user_id: 2 }
      ];
      
      const mockResult = { rows: mockTasks };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await taskModel.findAll();
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM tasks ORDER BY created_at DESC'
      );
      expect(result).toEqual(mockTasks);
    });
  });
});
