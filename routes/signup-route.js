import { Router } from 'express';
import SignUpController from '../controllers/signup-controller';
import AuthController from '../controllers/auth-controller';

const router = new Router();

router
  .get('/signup', SignUpController.signup)
  .post('/signup', SignUpController.register);
  
export default router;
  