import { Router } from 'express';
import UserController from '../controllers/user.controller';
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

router.get('/users/:name', UserController.getUser);

router.post('/users', UserController.addUser);

router.put('/users/:name', UserController.updateUser);

router.delete('/users/:name', UserController.deleteUser);

export default router;