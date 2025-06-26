import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

// Routes publiques
router.post('/register', (req: Request, res: Response) => {
  userController.register(req, res);
});

router.post('/login', (req: Request, res: Response) => {
  userController.login(req, res);
});

// Routes protégées
router.get('/profile', authMiddleware, (req: Request, res: Response) => {
  userController.getProfile(req, res);
});

router.put('/profile', authMiddleware, (req: Request, res: Response) => {
  userController.updateProfile(req, res);
});

router.delete('/account', authMiddleware, (req: Request, res: Response) => {
  userController.deleteAccount(req, res);
});

export default router;
