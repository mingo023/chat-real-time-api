import { Router } from 'express';
import GroupController from '../controllers/group.controller';
import validate from 'express-validation';
import validation from '../validation';
import authMiddleware from '../middlewares/auth.middleware';

const router = new Router();

router
  .get('/groups', validate(validation.group.getAll), authMiddleware.requireAuth, GroupController.getAll)
  .post('/groups', validate(validation.group.createGroup), authMiddleware.requireAuth, GroupController.create);

router
  .get('/groups/:id', validate(validation.group.getGroup), authMiddleware.requireAuth, GroupController.get)
  .put('/groups/:id', validate(validation.group.updateGroup), authMiddleware.requireAuth, GroupController.update)
  .delete('/groups/:id', validate(validation.group.deleteGroup), authMiddleware.requireAuth, GroupController.delete)
  .patch('/groups/:id', validate(validation.group.addMembers), authMiddleware.requireAuth, GroupController.addMembers);

router.delete('/groups/member/:id', authMiddleware.requireAuth, GroupController.deleteMembers);

export default router;
