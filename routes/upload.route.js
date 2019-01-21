import { Router } from 'express';
const router = new Router();

import UploadController from '../controllers/upload.controller';


router
  .get('/upload', UploadController.getFile)
  .post('/upload', UploadController.postFile);

export default router;
