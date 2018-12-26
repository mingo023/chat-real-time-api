import { Router } from 'express';
import GroupController from '../controllers/group.controller';
import validate from 'express-validation';
import validation from '../validation';

const router = new Router();

router.get('/groups', GroupController.getAll);

router.get('/groups/:id', GroupController.getGroup);

router.post('/groups', validate(validation.group), GroupController.addGroup);

router.put('/groups/:id', GroupController.updateGroup);

router.delete('/groups/:id', GroupController.deleteGroup);


export default router;
