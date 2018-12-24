import { Router } from 'express';
import ProductController from '../controllers/product.controller';
const router = new Router();

router.get('/products', ProductController.getAll);

router.get('/products/:id', ProductController.getProduct);

router.post('/products', ProductController.addProduct);

router.put('/products/:id', ProductController.updateProduct);

router.delete('/products/:id', ProductController.deleteProduct);

export default router;
