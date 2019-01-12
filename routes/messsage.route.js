import { Router } from 'express';
import MessageController from '../controllers/message.controller';
import validate from 'express-validation';
import validation from '../validation';
import authMiddleware from '../middlewares/auth.middleware';

const router = new Router();

router
  .get('/messages', authMiddleware.requireAuth, MessageController.getAll)
  .post('/messages', authMiddleware.requireAuth, MessageController.create);

router
  .get('/messages/:id', authMiddleware.requireAuth, MessageController.get)
  .put('/messages/:id', authMiddleware.requireAuth, MessageController.update);

router.delete('/messages/:id', authMiddleware.requireAuth, MessageController.delete);

export default router;