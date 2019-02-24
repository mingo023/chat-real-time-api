import { Router } from 'express';
import { MessageController } from '../controllers';
import validate from 'express-validation';
import validation from '../../validation';
import authMiddleware from '../../middlewares/auth-middleware';

const router = new Router();

router
  .get('/messages', authMiddleware.requireAuth, MessageController.getAll)
  .post('/messages', validate(validation.message.create()), authMiddleware.requireAuth, MessageController.create);

router
  .get('/messages/:id', validate(validation.message.get()), authMiddleware.requireAuth, MessageController.get)
  .put('/messages/:id', validate(validation.message.update()), authMiddleware.requireAuth, MessageController.update);

router.delete('/messages/:id', validate(validation.message.update()), authMiddleware.requireAuth, MessageController.delete);

export default router;