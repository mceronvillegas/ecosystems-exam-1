import type { Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import {
    createStoreService,
    deleteStoreService,
    getStoreByIdService,
    getStoresService,
    updateStoreService,
} from './store.service.js';
import type { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { getUserFromRequest } from '../../middlewares/authMiddleware.js';
// obtener todas las tiendas
export const getStoresController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const stores = await getStoresService();
        return res.json(stores);
    } catch (error) {
        next(error);
    }
};

// tienda por id
export const getStoreByIdController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const store = await getStoreByIdService(Number(id));
        return res.json(store);
    } catch (error) {
        next(error);
    }
};

// crear tienda
export const createStoreController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // saca al usuario del token para saber quién es el dueño
        const user = getUserFromRequest(req);

        if (!req.body) {
            throw Boom.badRequest('Request body is required');
        }

        const { storeName, description } = req.body;

        if (!storeName) {
            throw Boom.badRequest('Store name is required');
        }

        // pasa los datos y el ID del dueño al servicio
        const newStore = await createStoreService({ storeName, description }, user.id);
        
        return res.status(201).json(newStore);
    } catch (error) {
        next(error);
    }
};

// actualiza tienda
export const updateStoreController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = getUserFromRequest(req);
        const { id } = req.params;

        if (!req.body) {
            throw Boom.badRequest('Request body is required');
        }
        //campos a actualizar
        const { storeName, description, status } = req.body;

        // validar si si es el dueño
        const updatedStore = await updateStoreService(
            { storeName, description, status },
            Number(id),
            user.id
        );

        return res.json(updatedStore);
    } catch (error) {
        next(error);
    }
};

// eliminar
export const deleteStoreController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = getUserFromRequest(req);
        const { id } = req.params;

        await deleteStoreService(Number(id), user.id);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};