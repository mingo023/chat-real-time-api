import { Router } from 'express';
const router = new Router();

import UploadController from '../controllers/upload.controller';


router
  .get('/', UploadController.getUpload)
  .post('/', UploadController.postUpload);

export default router;
