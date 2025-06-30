// Définir les mocks avant d'importer les modules
const mockQuery = jest.fn();
const mockGenSalt = jest.fn().mockResolvedValue('salt');
const mockHash = jest.fn().mockResolvedValue('hashed_password');

// Mock de la connexion à la base de données
jest.mock('../config/db', () => ({
  __esModule: true,
  default: {
    query: mockQuery
  }
}));

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  genSalt: mockGenSalt,
  hash: mockHash
}));

// Importer les modules après les mocks
import { UserModel, User } from '../models/user.model';
import pool from '../config/db';
import bcrypt from 'bcrypt';

describe('UserModel', () => {
  let userModel: UserModel;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    mockQuery.mockReset();
    mockGenSalt.mockClear();
    mockHash.mockClear();
    
    // Créer une instance du modèle
    userModel = new UserModel();
  });

  describe('create', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      // Arrange
      const userData: User = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        password: 'password123'
      };
      
      const mockResult = {
        rows: [{
          id: 1,
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          created_at: new Date()
        }]
      };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await userModel.create(userData);
      
      // Assert
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 'salt');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [userData.nom, userData.prenom, userData.email, 'hashed_password']
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findByEmail', () => {
    it('devrait trouver un utilisateur par email', async () => {
      // Arrange
      const email = 'jean.dupont@example.com';
      const mockUser = {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        email,
        password: 'hashed_password',
        created_at: new Date()
      };
      
      const mockResult = {
        rows: [mockUser]
      };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await userModel.findByEmail(email);
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      expect(result).toEqual(mockUser);
    });

    it('devrait retourner null si l\'utilisateur n\'existe pas', async () => {
      // Arrange
      const email = 'inconnu@example.com';
      const mockResult = { rows: [] };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await userModel.findByEmail(email);
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('devrait trouver un utilisateur par ID', async () => {
      // Arrange
      const userId = 1;
      const mockUser = {
        id: userId,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        created_at: new Date()
      };
      
      const mockResult = {
        rows: [mockUser]
      };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await userModel.findById(userId);
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id, nom, prenom, email, created_at FROM users WHERE id = $1',
        [userId]
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un utilisateur sans mot de passe', async () => {
      // Arrange
      const userId = 1;
      const updateData = {
        nom: 'Martin',
        prenom: 'Jean',
        email: 'jean.martin@example.com'
      };
      
      const mockUpdatedUser = {
        id: userId,
        ...updateData,
        created_at: new Date()
      };
      
      const mockResult = { rows: [mockUpdatedUser] };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await userModel.update(userId, updateData);
      
      // Assert
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET'),
        expect.arrayContaining([updateData.nom, updateData.prenom, updateData.email, userId])
      );
      expect(result).toEqual(mockUpdatedUser);
    });

    it('devrait mettre à jour un utilisateur avec mot de passe', async () => {
      // Arrange
      const userId = 1;
      const updateData = {
        nom: 'Martin',
        password: 'nouveau_password'
      };
      
      const mockUpdatedUser = {
        id: userId,
        nom: updateData.nom,
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        created_at: new Date()
      };
      
      const mockResult = { rows: [mockUpdatedUser] };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await userModel.update(userId, updateData);
      
      // Assert
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(updateData.password, 'salt');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET'),
        expect.arrayContaining([updateData.nom, 'hashed_password', userId])
      );
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('delete', () => {
    it('devrait supprimer un utilisateur', async () => {
      // Arrange
      const userId = 1;
      const mockResult = { rowCount: 1 };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await userModel.delete(userId);
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM users WHERE id = $1',
        [userId]
      );
      expect(result).toBe(true);
    });

    it('devrait retourner false si l\'utilisateur n\'existe pas', async () => {
      // Arrange
      const userId = 999;
      const mockResult = { rowCount: 0 };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await userModel.delete(userId);
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM users WHERE id = $1',
        [userId]
      );
      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('devrait récupérer tous les utilisateurs', async () => {
      // Arrange
      const mockUsers = [
        { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@example.com', created_at: new Date() },
        { id: 2, nom: 'Martin', prenom: 'Marie', email: 'marie@example.com', created_at: new Date() }
      ];
      
      const mockResult = { rows: mockUsers };
      
      mockQuery.mockResolvedValue(mockResult);
      
      // Act
      const result = await userModel.findAll();
      
      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id, nom, prenom, email, created_at FROM users ORDER BY created_at DESC'
      );
      expect(result).toEqual(mockUsers);
    });
  });
});
