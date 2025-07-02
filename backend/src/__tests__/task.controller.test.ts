import { Request, Response } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskModel, Task } from '../models/task.model';

// Étendre l'interface Request pour inclure la propriété user
declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
    }
  }
}

// Mock du modèle TaskModel
jest.mock('../models/task.model', () => {
  return {
    TaskModel: jest.fn().mockImplementation(() => {
      return {
        create: jest.fn(),
        findById: jest.fn(),
        findByUserId: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findAll: jest.fn()
      };
    }),
    Task: {}
  };
});

describe('TaskController', () => {
  let taskController: TaskController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockTaskModel: jest.Mocked<TaskModel>;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    
    // Mock du modèle
    mockTaskModel = new TaskModel() as jest.Mocked<TaskModel>;
    
    // Créer une instance du contrôleur avec le modèle mocké
    taskController = new TaskController(mockTaskModel);
    
    // Mock de la requête
    mockRequest = {
      user: { userId: 1 },
      body: {},
      params: {}
    };
    
    // Mock de la réponse
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createTask', () => {
    it('devrait créer une tâche avec succès', async () => {
      // Arrange
      const taskData = {
        title: 'Nouvelle tâche',
        description: 'Description de la tâche',
        completed: false
      };
      
      mockRequest.body = taskData;
      
      const createdTask = {
        id: 1,
        ...taskData,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      mockTaskModel.create.mockResolvedValue(createdTask); // Retourne la tâche créée complète
      
      // Act
      await taskController.createTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockTaskModel.create).toHaveBeenCalledWith({
        ...taskData,
        user_id: 1
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Tâche créée avec succès',
        task: createdTask
      });
    });

    it('devrait renvoyer une erreur 400 si le titre est manquant', async () => {
      // Arrange
      mockRequest.body = {
        description: 'Description sans titre'
      };
      
      // Act
      await taskController.createTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockTaskModel.create).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Le titre est requis' });
    });

    it('devrait renvoyer une erreur 401 si l\'utilisateur n\'est pas authentifié', async () => {
      // Arrange
      mockRequest.user = undefined;
      mockRequest.body = {
        title: 'Titre de la tâche'
      };
      
      // Act
      await taskController.createTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockTaskModel.create).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Non autorisé' });
    });
  });

  describe('getUserTasks', () => {
    it('devrait récupérer toutes les tâches de l\'utilisateur', async () => {
      // Arrange
      const tasks = [
        { id: 1, title: 'Tâche 1', user_id: 1 },
        { id: 2, title: 'Tâche 2', user_id: 1 }
      ];
      
      mockTaskModel.findByUserId.mockResolvedValue(tasks);
      
      // Act
      await taskController.getUserTasks(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockTaskModel.findByUserId).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Tâches récupérées avec succès', tasks });
    });

    it('devrait renvoyer une erreur 401 si l\'utilisateur n\'est pas authentifié', async () => {
      // Arrange
      mockRequest.user = undefined;
      
      // Act
      await taskController.getUserTasks(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockTaskModel.findByUserId).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Non autorisé' });
    });
  });

  describe('getTaskById', () => {
    it('devrait récupérer une tâche spécifique par son ID', async () => {
      // Arrange
      const task = { id: 1, title: 'Tâche 1', user_id: 1 };
      mockRequest.params = { id: '1' };
      mockTaskModel.findById.mockResolvedValue(task);
      
      // Act
      await taskController.getTaskById(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockTaskModel.findById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Tâche récupérée avec succès', task });
    });

    it('devrait renvoyer une erreur 404 si la tâche n\'existe pas', async () => {
      // Arrange
      mockRequest.params = { id: '999' };
      mockTaskModel.findById.mockResolvedValue(null);
      
      // Act
      await taskController.getTaskById(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockTaskModel.findById).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Tâche non trouvée' });
    });

    it('devrait renvoyer une erreur 403 si la tâche appartient à un autre utilisateur', async () => {
      // Arrange
      const task = { id: 1, title: 'Tâche 1', user_id: 2 }; // Appartient à l'utilisateur 2
      mockRequest.params = { id: '1' };
      mockRequest.user = { userId: 1 }; // Utilisateur 1 essaie d'y accéder
      mockTaskModel.findById.mockResolvedValue(task);
      
      // Act
      await taskController.getTaskById(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockTaskModel.findById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Accès non autorisé à cette tâche' });
    });
  });

  describe('updateTask', () => {
    it('devrait mettre à jour une tâche avec succès', async () => {
      // Arrange
      const taskId = 1;
      const existingTask = { id: taskId, title: 'Ancienne tâche', description: 'Ancienne description', user_id: 1 };
      const updateData = { title: 'Tâche mise à jour', description: 'Nouvelle description', completed: true };
      const updatedTask = { ...existingTask, ...updateData };
      
      mockRequest.params = { id: taskId.toString() };
      mockRequest.body = updateData;
      mockTaskModel.findById.mockResolvedValue(existingTask);
      mockTaskModel.update.mockResolvedValue(updatedTask);
      
      // Act
      await taskController.updateTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockTaskModel.findById).toHaveBeenCalledWith(taskId);
      expect(mockTaskModel.update).toHaveBeenCalledWith(taskId, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Tâche mise à jour avec succès',
        task: updatedTask
      });
    });
  });

  describe('deleteTask', () => {
    it('devrait supprimer une tâche avec succès', async () => {
      // Arrange
      const taskId = 1;
      const existingTask = { id: taskId, title: 'Tâche à supprimer', user_id: 1 };
      
      mockRequest.params = { id: taskId.toString() };
      
      // S'assurer que le mock est correctement réinitialisé
      mockTaskModel.findById.mockReset();
      mockTaskModel.findById.mockResolvedValue(existingTask);
      mockTaskModel.delete.mockResolvedValue(true);
      
      // Act
      await taskController.deleteTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockTaskModel.findById).toHaveBeenCalledWith(taskId);
      expect(mockTaskModel.delete).toHaveBeenCalledWith(taskId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Tâche supprimée avec succès' });
    });
  });
});
