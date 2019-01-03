import { Router } from 'express';
import UserController from '../controllers/user.controller';
import validate from 'express-validation';
import validation from '../validation';

const router = new Router();

// Get all users
// ResfulAPI:
// Get data: method : GET
// Create new data : method: POST
// Update data: method: PUT
// DElete data: method: DELETE
// PATCH.. Update
// ResfulAPI naming

router.get('/users', UserController.getAll);

router.get('/users/:id', validate(validation.user.getUser), UserController.getUser);

router.post('/users', validate(validation.user.createUser), UserController.addUser);

router.put('/users/:id', validate(validation.user), UserController.updateUser);

router.delete('/users/:id', UserController.deleteUser);

router.get('/search', (req, res) => {
  const query = req.query;
  return res.json({ query });
});

export default router;