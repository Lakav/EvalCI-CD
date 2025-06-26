import { Request, Response } from 'express';
import { UserModel, User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const userModel = new UserModel();

export class UserController {
  // Inscription d'un nouvel utilisateur
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { nom, prenom, email, password } = req.body;
      
      // Vérifier si tous les champs requis sont présents
      if (!nom || !prenom || !email || !password) {
        res.status(400).json({ message: 'Tous les champs sont requis' });
        return;
      }
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'Cet email est déjà utilisé' });
        return;
      }
      
      // Créer le nouvel utilisateur
      const newUser: User = {
        nom,
        prenom,
        email,
        password
      };

      const userId = await userModel.create(newUser);

      // Générer un token JWT
      const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: {
          id: userId,
          nom: newUser.nom,
          prenom: newUser.prenom,
          email: newUser.email
        },
        token
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
  
  // Connexion d'un utilisateur
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      // Vérifier si l'email et le mot de passe sont fournis
      if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
      }
      
      // Vérifier si l'utilisateur existe
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
      
      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
      
      // Générer un token JWT
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );
      
      res.status(200).json({
        message: 'Connexion réussie',
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
  
  // Obtenir le profil de l'utilisateur connecté
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
      
      const user = await userModel.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      res.status(200).json({
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
  
  // Mettre à jour le profil de l'utilisateur
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { nom, prenom, email, password } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
      
      // Vérifier si l'utilisateur existe
      const existingUser = await userModel.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      // Si l'email est modifié, vérifier qu'il n'est pas déjà utilisé
      if (email && email !== existingUser.email) {
        const userWithEmail = await userModel.findByEmail(email);
        if (userWithEmail) {
          return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
      }
      
      // Mettre à jour l'utilisateur
      const updatedUser = await userModel.update(userId, {
        nom,
        prenom,
        email,
        password
      });
      
      res.status(200).json({
        message: 'Profil mis à jour avec succès',
        user: {
          id: updatedUser?.id,
          nom: updatedUser?.nom,
          prenom: updatedUser?.prenom,
          email: updatedUser?.email
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
  
  // Supprimer le compte utilisateur
  async deleteAccount(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
      
      const deleted = await userModel.delete(userId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      res.status(200).json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}
