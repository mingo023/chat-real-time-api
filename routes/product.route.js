import { Router } from 'express';
import ProductController from '../controllers/product.controller';
const router = new Router();

router.get('/products', ProductController.getAll);

router.get('/products/:name', ProductController.getProduct);

router.post('/products', ProductController.addProduct);

router.put('/products/:name', ProductController.updateProduct);

router.delete('/products/:name', ProductController.deleteProduct);

export default router;
