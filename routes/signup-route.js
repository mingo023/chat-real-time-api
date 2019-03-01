import { Router } from 'express';
import SignUpController from '../controllers/signup-controller';
import AuthController from '../controllers/auth-controller';

const router = new Router();

router
  .get('/signup', SignUpController.signup);
router  
  .get('/login', AuthController.login)
  .post('/login', AuthController.postLogin);
router
  .get('/signup', )
  
export default router;
  