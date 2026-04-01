import type { Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import {
    createProductService,
    deleteProductService,
    getProductByIdService,
    getProductsService,
    updateProductService,
} from './product.service.js';
import type { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { getUserFromRequest } from '../../middlewares/authMiddleware.js';
import { getStoreByOwnerIdService } from '../stores/store.service.js';

export const getProductsController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { storeId } = req.query;

        // convterie texto a num si se envio algo
        const parsedStoreId = storeId ? Number(storeId) : undefined;

        // se le pasa num al servicio
        const products = await getProductsService(parsedStoreId);

        return res.json(products);
    } catch (error) {
        next(error);
    }
};

export const getProductByIdController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const product = await getProductByIdService(Number(id));
        return res.json(product);
    } catch (error) {
        next(error);
    }
};

export const createProductController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = getUserFromRequest(req);
        const store = await getStoreByOwnerIdService(user.id);

        if (!req.body) {
            throw Boom.badRequest('Request body is required');
        }

        // Solo se extrae name y price
        const { name, price } = req.body;

        if (!name) throw Boom.badRequest('Name is required');
        if (price === undefined) throw Boom.badRequest('Price is required');

        const newProduct = await createProductService({
            name,
            price,
            storeId: store.id, 
        });

        return res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
};

export const updateProductController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.body) {
            throw Boom.badRequest('Request body is required');
        }

        const { id } = req.params;
        const { price } = req.body;

        const updatedProduct = await updateProductService(Number(id), { price });

        return res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

export const deleteProductController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = getUserFromRequest(req);
        const { id } = req.params;

        const store = await getStoreByOwnerIdService(user.id);

        // Le pasamos el store.id para que el servicio valide que solo borre sus productos
        await deleteProductService(Number(id), store.id);

        return res.send('Product deleted');
    } catch (error) {
        next(error);
    }
};