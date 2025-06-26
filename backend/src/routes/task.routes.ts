import { Router, Request, Response } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const taskController = new TaskController();

// Toutes les routes de tâches nécessitent une authentification
router.use(authMiddleware);

router.post('/', (req: Request, res: Response) => {
  taskController.createTask(req, res);
});

router.get('/', (req: Request, res: Response) => {
  taskController.getUserTasks(req, res);
});

router.get('/:id', (req: Request, res: Response) => {
  taskController.getTaskById(req, res);
});

router.put('/:id', (req: Request, res: Response) => {
  taskController.updateTask(req, res);
});

router.delete('/:id', (req: Request, res: Response) => {
  taskController.deleteTask(req, res);
});

export default router;
