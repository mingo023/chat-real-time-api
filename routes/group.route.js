import { Router } from 'express';
import GroupController from '../controllers/group.controller';
import validate from 'express-validation';
import validation from '../validation';

const router = new Router();

router.get('/groups', GroupController.getAll);

router.get('/groups/:id', validate(validation.group.getGroup) , GroupController.getGroup);

router.post('/groups', validate(validation.group.createGroup), GroupController.addGroup);

router.put('/groups/:id', validate(validation.group.updateGroup), GroupController.updateGroup);

router.delete('/groups/:id', validate(validation.group.deleteGroup), GroupController.deleteGroup);


export default router;
