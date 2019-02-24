import { Router } from 'express';
import ChatController from '../controllers/chat-controller';
import AuthController from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth-middleware';

const router = new Router();

// router
//   .get('/', requireAuth, ChatController.chat);
router
  .get('/chat/login', ChatController.login);
  


export default router;
  