import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Interface pour étendre la requête Express avec les informations utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
      return;
    }

    // Extraire le token
    const token = authHeader.split(' ')[1];

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    // Ajouter les informations de l'utilisateur à la requête
    req.user = {
      userId: decoded.userId
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Accès non autorisé. Token invalide.' });
    return;
  }
};
