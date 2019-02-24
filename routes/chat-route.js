import { Router } from 'express';
import ChatController from '../controllers/chat-controller';
import AuthController from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth-middleware';

const router = new Router();

router
  .get('/chat', AuthController.auth, ChatController.chat);
router  
  .post('/login', AuthController.postLogin);
  


export default router;
  