import { Router } from 'express';
import UserController from '../controllers/user.controller';
import validate from 'express-validation';
import validation from '../validation';
import authMiddleware from '../middlewares/auth.middleware';

const router = new Router();

// Get all users
// ResfulAPI:
// Get data: method : GET
// Create new data : method: POST
// Update data: method: PUT
// DElete data: method: DELETE
// PATCH.. Update
// ResfulAPI naming

router
  .get('/users', authMiddleware.requireAuth, UserController.getAll)
  .post('/users', validate(validation.user.create), UserController.create);

router
  .get('/users/:id', validate(validation.user.get), authMiddleware.requireAuth, UserController.get)
  .put('/users/:id', validate(validation.user.update), authMiddleware.requireAuth, UserController.update);

router.post('/login', validate(validation.user.login), UserController.login);

router.put('/users/password/change-password', validate(validation.user.changePassword), authMiddleware.requireAuth, UserController.changePassword);

router.delete('/users/:id', authMiddleware.requireAuth, UserController.delete);


export default router;