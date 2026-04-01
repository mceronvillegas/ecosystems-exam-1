import { Router } from 'express';
import {
    createStoreController,
    deleteStoreController,
    getStoreByIdController,
    getStoresController,
    updateStoreController,
} from './store.controller.js'; 
import { authMiddleware, checkRole } from '../../middlewares/authMiddleware.js'; 

export const storeRouter = Router();

// token válido para interactuar con las tiendas
storeRouter.use(authMiddleware);

// Los consumidores necesitan ver las tiendas para saber dónde comprar
storeRouter.get('/', getStoresController);
storeRouter.get('/:id', getStoreByIdController);

// Crear una tienda por si no se creo al registrarse
storeRouter.post('/', checkRole(['store']), createStoreController);

// Actualizar perfil de la tienda 
storeRouter.patch('/:id', checkRole(['store']), updateStoreController);

// Borrar la tienda 
storeRouter.delete('/:id', checkRole(['store']), deleteStoreController);