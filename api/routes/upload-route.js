import { Router } from 'express';
const router = new Router();

import { UploadController } from '../controllers';
import { requireAuth } from '../../middlewares/auth-middleware';
import { checkBlock } from '../../middlewares/block-middleware';

router
  .post('/upload', requireAuth, checkBlock, UploadController.postFile);

export default router;
