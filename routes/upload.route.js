import { Router } from 'express';
const router = new Router();

import UploadController from '../controllers/upload.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { checkBlock } from '../middlewares/checkblock.middleware';

router
  .get('/upload', UploadController.getFile)
  .post('/upload', requireAuth, checkBlock, UploadController.postFile);

export default router;
