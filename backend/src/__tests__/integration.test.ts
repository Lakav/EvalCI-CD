import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { UserController } from '../controllers/user.controller';
import { TaskController } from '../controllers/task.controller';
import { UserModel } from '../models/user.model';
import { TaskModel } from '../models/task.model';
import jwt from 'jsonwebtoken';

// Étendre l'interface Request pour inclure la propriété user
declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
    }
  }
}

// Mock des modèles
jest.mock('../models/user.model', () => {
  return {
    UserModel: jest.fn().mockImplementation(() => {
      return {
        create: jest.fn().mockImplementation((userData) => {
          return Promise.resolve({
            id: 1,
            nom: userData.nom,
            prenom: userData.prenom,
            email: userData.email,
            created_at: new Date().toISOString()
          });
        }),
        findByEmail: jest.fn().mockImplementation((function() {
          let callCount = 0;
          return function(email) {
            if (email === 'test@example.com') {
              // Premier appel pour l'enregistrement retourne null (utilisateur n'existe pas encore)
              // Appels suivants pour la connexion retournent un utilisateur existant
              if (callCount === 0) {
                callCount++;
                return null;
              }
              return { id: 1, email, nom: 'Test', prenom: 'User', password: 'hashed_password' };
            }
            return null;
          };
        })()),
        findById: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', nom: 'Test', prenom: 'User' }),
        update: jest.fn().mockResolvedValue(true),
        delete: jest.fn().mockResolvedValue(true)
      };
    })
  };
});

jest.mock('../models/task.model', () => {
  return {
    TaskModel: jest.fn().mockImplementation(() => {
      return {
        create: jest.fn().mockImplementation((task) => {
          return Promise.resolve({
            id: 1,
            ...task
          });
        }),
        findByUserId: jest.fn().mockResolvedValue([{ id: 1, title: 'Nouvelle tâche', description: 'Description de la tâche', completed: false, user_id: 1 }]),
        findById: jest.fn().mockResolvedValue({ id: 1, title: 'Nouvelle tâche', description: 'Description de la tâche', completed: false, user_id: 1 }),
        update: jest.fn().mockImplementation((id, data) => {
          return Promise.resolve({
            id: id,
            ...data
          });
        }),
        delete: jest.fn().mockResolvedValue(true)
      };
    })
  };
});

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('salt')
}));

// Mock de jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn().mockImplementation(() => ({ userId: 1 }))
}));

describe('API Integration Tests', () => {
  let app: express.Application;
  let authToken: string;
  
  beforeAll(() => {
    // Mock de process.env.JWT_SECRET
    process.env.JWT_SECRET = 'test-secret';
    // Configuration de l'application Express pour les tests
    app = express();
    app.use(express.json());
    
    // Configuration des routes
    const taskController = new TaskController();
    const userController = new UserController();
    
    // Mock du middleware d'authentification
    const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: 1 };
      next();
    };
    
    // Wrappers pour les méthodes du contrôleur pour éviter les problèmes de type avec Express
    const registerHandler = (req: Request, res: Response) => {
      userController.register(req, res);
      return;
    };
    
    const loginHandler = (req: Request, res: Response) => {
      userController.login(req, res);
      return;
    };
    
    const getProfileHandler = (req: Request, res: Response) => {
      userController.getProfile(req, res);
      return;
    };
    
    const updateProfileHandler = (req: Request, res: Response) => {
      userController.updateProfile(req, res);
      return;
    };
    
    const deleteAccountHandler = (req: Request, res: Response) => {
      userController.deleteAccount(req, res);
      return;
    };
    
    const createTaskHandler = (req: Request, res: Response) => {
      taskController.createTask(req, res);
      return;
    };
    
    const getUserTasksHandler = (req: Request, res: Response) => {
      taskController.getUserTasks(req, res);
      return;
    };
    
    const getTaskByIdHandler = (req: Request, res: Response) => {
      taskController.getTaskById(req, res);
      return;
    };
    
    const updateTaskHandler = (req: Request, res: Response) => {
      taskController.updateTask(req, res);
      return;
    };
    
    const deleteTaskHandler = (req: Request, res: Response) => {
      taskController.deleteTask(req, res);
      return;
    };
    
    // Configuration des routes
    app.post('/api/users/register', registerHandler);
    app.post('/api/users/login', loginHandler);
    app.get('/api/users/profile', authMiddleware, getProfileHandler);
    app.put('/api/users/profile', authMiddleware, updateProfileHandler);
    app.delete('/api/users/profile', authMiddleware, deleteAccountHandler);
    
    app.post('/api/tasks', authMiddleware, createTaskHandler);
    app.get('/api/tasks', authMiddleware, getUserTasksHandler);
    app.get('/api/tasks/:id', authMiddleware, getTaskByIdHandler);
    app.put('/api/tasks/:id', authMiddleware, updateTaskHandler);
    app.delete('/api/tasks/:id', authMiddleware, deleteTaskHandler);
    
    // Générer un token de test
    authToken = 'test-token';
    (jwt.verify as jest.Mock).mockImplementation(() => ({ userId: 1 }));
  });
  
  describe('User API', () => {
    test('POST /api/users/register - devrait créer un nouvel utilisateur', async () => {
      const userData = {
        nom: 'Test',
        prenom: 'User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/users/register')
        .send(userData);
      
      console.log('Register response:', response.status, response.body);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
    });
    
    test('POST /api/users/login - devrait connecter un utilisateur', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });
    
    test('GET /api/users/profile - devrait récupérer le profil utilisateur', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
    });
  });
  
  describe('Task API', () => {
    it('POST /api/tasks - devrait créer une nouvelle tâche', async () => {
      const taskData = {
        title: 'Nouvelle tâche',
        description: 'Description de la tâche',
        completed: false
      };
      
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('task');
      expect(response.body.task).toHaveProperty('id');
      expect(response.body.task.title).toBe(taskData.title);
    });
    
    it('GET /api/tasks - devrait récupérer toutes les tâches de l\'utilisateur', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tasks');
      expect(Array.isArray(response.body.tasks)).toBe(true);
    });
    
    it('GET /api/tasks/:id - devrait récupérer une tâche spécifique', async () => {
      const taskId = 1;
      
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('task');
      expect(response.body.task).toHaveProperty('id', taskId);
    });
    
    it('PUT /api/tasks/:id - devrait mettre à jour une tâche', async () => {
      const taskId = 1;
      const updateData = {
        title: 'Tâche mise à jour',
        completed: true
      };
      
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('task');
      expect(response.body.task.title).toBe(updateData.title);
      expect(response.body.task.completed).toBe(updateData.completed);
    });
    
    it('DELETE /api/tasks/:id - devrait supprimer une tâche', async () => {
      const taskId = 1;
      
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Tâche supprimée avec succès');
    });
  });
});
