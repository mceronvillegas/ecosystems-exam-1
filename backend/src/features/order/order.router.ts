import { Router } from 'express';
import {
    createOrderController,
    deleteOrderController,
    getOrderByIdController,
    getOrdersController,
    updateOrderController,
} from './order.controller.js'; 


import { authMiddleware, checkRole } from '../../middlewares/authMiddleware.js';

export const orderRouter = Router();

// Todas las rutas debajo de esta línea requieren autenticación
orderRouter.use(authMiddleware);

orderRouter.get('/', getOrdersController);
orderRouter.get('/:id', getOrderByIdController);



// Solo el CONSUMIDOR puede crear un nuevo carrito/pedido
orderRouter.post('/', checkRole(['consumer']), createOrderController);

// Solo la TIENDA (para aceptar/rechazar) y el REPARTIDOR (para actualizar entrega) pueden modificarla
orderRouter.patch('/:id', checkRole(['store', 'delivery']), updateOrderController);

// Solo el CONSUMIDOR puede arrepentirse y cancelar/borrar su pedido (si sigue pending)
orderRouter.delete('/:id', checkRole(['consumer']), deleteOrderController);