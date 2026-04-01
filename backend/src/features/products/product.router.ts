import { Router } from 'express';
import {
    createProductController,
    deleteProductController,
    getProductByIdController,
    getProductsController,
    updateProductController,
} from './product.controller.js'; 
import { authMiddleware, checkRole } from '../../middlewares/authMiddleware.js';

export const productRouter = Router();

// Todos los que quieran ver o modificar productos deben estar autenticados
productRouter.use(authMiddleware);

// Consumidores, tiendas y repartidores pueden ver el menú
productRouter.get('/', getProductsController);
productRouter.get('/:id', getProductByIdController);

// Solo el rol 'store' puede hacer estas acciones
productRouter.post('/', checkRole(['store']), createProductController);
productRouter.patch('/:id', checkRole(['store']), updateProductController);
productRouter.delete('/:id', checkRole(['store']), deleteProductController);