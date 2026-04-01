import type { Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import {
    createOrderService,
    deleteOrderService,
    getOrderByIdService,
    getOrdersService,
    updateOrderService,
} from './order.service.js';
// Asegúrate de que la ruta apunte correctamente a donde guardaste tu authMiddleware
import type { AuthenticatedRequest} from '../../middlewares/authMiddleware.js';
import { getUserFromRequest } from '../../middlewares/authMiddleware.js';

export const getOrdersController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = getUserFromRequest(req);
        // En Supabase, el rol que le pasamos al registrarse se guarda en user_metadata
        const role = user.user_metadata?.role as string;

        const orders = await getOrdersService(user.id, role);
        return res.json(orders);
    } catch (error) {
        next(error);
    }
};

export const getOrderByIdController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);

        // Validamos que el ID no sea un texto raro (ej. /api/orders/hola)
        if (isNaN(id)) {
            throw Boom.badRequest('Order ID must be a valid number');
        }

        const order = await getOrderByIdService(id);
        return res.json(order);
    } catch (error) {
        next(error);
    }
};

export const createOrderController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = getUserFromRequest(req);

        if (!req.body) {
            throw Boom.badRequest('Request body is required');
        }

        // Extraemos TUS columnas reales
        const { storeId, address, paymentMethod, totalPrice, products } = req.body;

        // Validaciones
        if (storeId === undefined) throw Boom.badRequest('StoreId is required');
        if (address === undefined) throw Boom.badRequest('Address is required');
        if (paymentMethod === undefined) throw Boom.badRequest('Payment method is required');
        if (totalPrice === undefined) throw Boom.badRequest('Total price is required');

        // Validamos que haya un arreglo de productos y no esté vacío
        if (!products || !Array.isArray(products) || products.length === 0) {
            throw Boom.badRequest('At least one product is required');
        }

        const newOrder = await createOrderService(req.body, user.id);
        return res.status(201).json(newOrder);
    } catch (error) {
        next(error);
    }
};

export const updateOrderController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.body) {
            throw Boom.badRequest('Request body is required');
        }

        const id = Number(req.params.id);
        if (isNaN(id)) throw Boom.badRequest('Order ID must be a valid number');

        const { status, deliveryId } = req.body;

        const updateOrder = await updateOrderService(
            {
                status,
                deliveryId,
            },
            id
        );
        return res.json(updateOrder);
    } catch (error) {
        next(error);
    }
};

export const deleteOrderController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = getUserFromRequest(req);
        const id = Number(req.params.id);
        if (isNaN(id)) throw Boom.badRequest('Order ID must be a valid number');

        await deleteOrderService(id, user.id);

        // El status 204 (No Content) es el estándar REST para decir "se borró bien, no hay nada más que mostrar"
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};