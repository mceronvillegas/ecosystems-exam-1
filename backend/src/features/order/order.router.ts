import { Router } from 'express';
import {
  createOrderController,
  deleteOrderController,
  getOrderByIdController,
  getOrdersController,
  updateOrderController,
} from './order.controller.js'; // <-- No olvides el .js
// Revisa que esta ruta coincida con la ubicación exacta de tu middleware en tu proyecto
import { authMiddleware, checkRole } from '../../middlewares/authMiddleware.js';

export const orderRouter = Router(); 

// Todas las rutas debajo de esta línea requieren autenticación
orderRouter.use(authMiddleware);

// ==========================================
// RUTAS DE LECTURA (Todos los roles pueden entrar)
// ==========================================
// Nota: Entran todos, pero el controlador se encarga de mostrarles solo lo que les corresponde
orderRouter.get('/', getOrdersController);
orderRouter.get('/:id', getOrderByIdController);

// ==========================================
// RUTAS DE ESCRITURA (Protegidas por el Cadenero VIP: checkRole)
// ==========================================

// Solo el CONSUMIDOR puede crear un nuevo carrito/pedido
orderRouter.post('/', checkRole(['consumer']), createOrderController);

// Solo la TIENDA (para aceptar/rechazar) y el REPARTIDOR (para actualizar entrega) pueden modificarla
orderRouter.patch('/:id', checkRole(['store', 'delivery']), updateOrderController);

// Solo el CONSUMIDOR puede arrepentirse y cancelar/borrar su pedido (si sigue pending)
orderRouter.delete('/:id', checkRole(['consumer']), deleteOrderController);