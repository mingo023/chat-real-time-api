import { Router } from 'express';
import GroupController from '../controllers/group.controller';
import validate from 'express-validation';
import validation from '../validation';

const router = new Router();

router
  .get('/groups', validate(validation.group.getAll), GroupController.getAll)
  .post('/groups', validate(validation.group.createGroup), GroupController.create);

router.get('/groups/:id', validate(validation.group.getGroup), GroupController.get)
  .put('/groups/:id', validate(validation.group.updateGroup), GroupController.update)
  .delete('/groups/:id', validate(validation.group.deleteGroup), GroupController.delete)
  .patch('/groups/:id', validate(validation.group.addMembers), GroupController.addMembers);

router.delete('/groups/member/:id', GroupController.deleteMembers);

export default router;
