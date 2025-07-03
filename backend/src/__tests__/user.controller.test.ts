// Définir les mocks avant d'importer les modules
const mockHash = jest.fn().mockResolvedValue('hashed_password');
const mockCompare = jest.fn().mockResolvedValue(true);
const mockGenSalt = jest.fn().mockResolvedValue('fake_salt');
const mockSign = jest.fn().mockReturnValue('fake_token');

// Mock de bcrypt et jsonwebtoken
jest.mock('bcrypt', () => ({
  hash: mockHash,
  compare: mockCompare,
  genSalt: mockGenSalt
}));

jest.mock('jsonwebtoken', () => ({
  sign: mockSign
}));

// Mock du modèle UserModel
const mockCreate = jest.fn();
const mockFindByEmail = jest.fn();
const mockFindById = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockFindAll = jest.fn();

jest.mock('../models/user.model', () => ({
  UserModel: jest.fn().mockImplementation(() => ({
    create: mockCreate,
    findByEmail: mockFindByEmail,
    findById: mockFindById,
    update: mockUpdate,
    delete: mockDelete,
    findAll: mockFindAll
  }))
}));

// Importer les modules après les mocks
import { Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserModel, User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Étendre l'interface Request pour inclure la propriété user
declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
    }
  }
}

// Étendre l'interface User pour rendre password optionnel dans les tests
type PartialTestUser = Omit<User, 'password'> & { password?: string };

describe('UserController', () => {
  let userController: UserController;
  let mockRequest: any;
  let mockResponse: any;
  let mockUserModel: any;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    
    // Créer une instance du contrôleur avec le modèle mocké
    userController = new UserController();
    
    // Remplacer l'instance du modèle dans le contrôleur
    // @ts-ignore - Accès à une propriété privée pour les tests
    userController['userModel'] = {
      create: mockCreate,
      findByEmail: mockFindByEmail,
      findById: mockFindById,
      update: mockUpdate,
      delete: mockDelete,
      findAll: mockFindAll
    };
    
    // Mock de la requête
    mockRequest = {
      body: {},
      params: {}
    };
    
    // Mock de la réponse
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Mock de process.env
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('login', () => {
    test('login - devrait connecter un utilisateur avec succès', async () => {
      const loginData = {
        email: 'jean.dupont@example.com',
        password: 'password123'
      };
      
      const userData = {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        email: loginData.email,
        password: 'hashed_password'
      };
      
      const token = 'fake_token';
      
      mockRequest.body = loginData;
      mockFindByEmail.mockResolvedValue(userData);
      mockCompare.mockResolvedValue(true);
      mockSign.mockReturnValue(token);
      
      await userController.login(mockRequest as Request, mockResponse as Response);
      
      expect(mockFindByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, userData.password);
      expect(jwt.sign).toHaveBeenCalledWith({ userId: userData.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Connexion réussie',
        user: expect.objectContaining({
          id: userData.id,
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email
        }),
        token
      });
    });

    it('devrait renvoyer une erreur 401 si le mot de passe est incorrect', async () => {
      // Arrange
      const loginData = {
        email: 'jean.dupont@example.com',
        password: 'wrong_password'
      };
      
      const userData = {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        email: loginData.email,
        password: 'hashed_password'
      } as User;
      
      mockRequest.body = loginData;
      mockFindByEmail.mockResolvedValue(userData);
      mockCompare.mockResolvedValue(false);
      
      // Réinitialiser le mock de jwt.sign avant le test
      mockSign.mockClear();
      
      // Act
      await userController.login(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockFindByEmail).toHaveBeenCalledWith(loginData.email);
      expect(mockCompare).toHaveBeenCalledWith(loginData.password, userData.password);
      expect(mockSign).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Email ou mot de passe incorrect' });
    });
  });

  describe('getProfile', () => {
    test('getProfile - devrait récupérer le profil utilisateur avec succès', async () => {
      const userId = 1;
      const userData = {
        id: userId,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        password: 'hashed_password',
        created_at: new Date()
      } as User;
      
      mockRequest.user = { userId };
      // Créer une copie de userData sans le mot de passe pour simuler le comportement du contrôleur
      const userDataWithoutPassword = {
        id: userData.id,
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        created_at: userData.created_at
      };
      mockFindById.mockResolvedValue(userData);
      
      await userController.getProfile(mockRequest as Request, mockResponse as Response);
      
      expect(mockFindById).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ user: userDataWithoutPassword });
    });
  });

  // Note: La méthode getAllUsers n'existe pas dans le contrôleur UserController
  // Ce test a été supprimé car il teste une fonctionnalité qui n'existe pas

  describe('updateProfile', () => {
    test('updateProfile - devrait mettre à jour le profil avec succès', async () => {
      const userId = 1;
      const existingUser = {
        id: userId,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        password: 'hashed_password'
      } as User;
      
      const updateData = {
        nom: 'Martin',
        email: 'jean.martin@example.com'
      };
      
      const updatedUser = { ...existingUser, ...updateData } as User;
      
      mockRequest.user = { userId };
      mockRequest.body = updateData;
      mockFindById.mockResolvedValue(existingUser);
      mockFindByEmail.mockResolvedValue(null);
      mockUpdate.mockResolvedValue(updatedUser);
      
      await userController.updateProfile(mockRequest as Request, mockResponse as Response);
      
      // Créer une copie de updatedUser sans le mot de passe pour simuler le comportement du contrôleur
      const updatedUserWithoutPassword = {
        id: updatedUser.id,
        nom: updatedUser.nom,
        prenom: updatedUser.prenom,
        email: updatedUser.email
      };
      
      expect(mockFindById).toHaveBeenCalledWith(userId);
      expect(mockFindByEmail).toHaveBeenCalledWith(updateData.email);
      expect(mockUpdate).toHaveBeenCalledWith(userId, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Profil mis à jour avec succès', user: updatedUserWithoutPassword });
    });
  });

  describe('deleteAccount', () => {
    test('deleteAccount - devrait supprimer le compte utilisateur avec succès', async () => {
      const userId = 1;
      
      mockRequest.user = { userId };
      mockDelete.mockResolvedValue(true);
      
      await userController.deleteAccount(mockRequest as Request, mockResponse as Response);
      
      expect(mockDelete).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Compte supprimé avec succès' });
    });
  });
});
