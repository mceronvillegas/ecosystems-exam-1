import { type Order, type CreateOrderDTO, type UpdateOrderStatusDTO, OrderStatus } from './order.types.js';
import Boom from '@hapi/boom';
import { pool } from '../../config/database.js';

export const getOrdersService = async (
    userId: string,
    role: string
): Promise<Order[]> => {
    //se usan las columnas exactas para obtener las ordenes
    let query = `SELECT id, status, total_price as "totalPrice", address, payment_method as "paymentMethod", 
            order_detail as "orderDetail", consumer_id as "consumerId", 
            store_id as "storeId", delivery_id as "deliveryId" 
    FROM orders`;

    const params: any[] = [];

    if (role === 'consumer') {
        query += 'WHERE consumer_id = $1';
        params.push(userId);
    } else if (role === 'store') {
        query += ' WHERE store_id = (SELECT id FROM stores WHERE owner_id = $1 LIMIT 1)'
        params.push(userId);
    } else if (role === 'delivery') {
        // El repartidor ve las que aceptó la tienda o las que él ya tomó
        query += "WHERE delivery_id = $1 OR status = 'accepted'";
        params.push(userId);
    } else {
        return [];
    }

    //ID descendiente para ver las ordenes y q los mas nuevos queden de primeros
    query += 'ORDER BY DESC';

    const dbRequest = await pool.query(query,params);
    return dbRequest.rows;
};

export const getOrderByIdService = async (orderId: number): Promise<Order> => {
    const dbRequest = await pool.query(
        `SELECT id, status, total_price as "totalPrice", address, payment_method as "paymentMethod", 
                order_detail as "orderDetail", consumer_id as "consumerId", 
                store_id as "storeId", delivery_id as "deliveryId" 
        FROM orders WHERE id = $1`,
        [orderId]
    );

    if (dbRequest.rowCount === 0) {
        throw Boom.notFound('Order not found');
    }

    const order = dbRequest.rows[0];

    //Se consulta la tabla order products
    const itemsRequest = await pool.query(
        `SELECT id, order_id as "orderId", product_id as "productId", quantity 
        FROM order_products WHERE order_id = $1`,
        [orderId]
    );

    order.products = itemsRequest.rows; //se asignan los productos a la orden
    return order;
};

export const createOrderService = async (
    order: CreateOrderDTO,
    consumerId: string
): Promise<Order> => {
    //se inserta la orden con mis columnas
    const dbRequest = await pool.query(
        `INSERT INTO orders (status, total_price, address, payment_method, order_detail, consumer_id, store_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING id, status, total_price as "totalPrice", address, payment_method as "paymentMethod", 
        order_detail as "orderDetail", consumer_id as "consumerId", store_id as "storeId"`,
        [
            OrderStatus.PENDING,
            order.totalPrice,
            order.address,
            order.paymentMethod,
            order.orderDetail,
            consumerId,
            order.storeId,
        ]
    );

    const finalOrder = dbRequest.rows[0];

    //se insertan los productos en order_products
    for (const product of order.products) {
        await pool.query(
            'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)',
            [finalOrder.id, product.productId, product.quantity]
        );
    }

    finalOrder.products = order.products;

    return finalOrder;
};

export const updateOrderService = async (
    orderUpdate: UpdateOrderStatusDTO,
    orderId: number
): Promise<Order> => {
    // existe?
    const orderFound = await getOrderByIdService(orderId);

    // Si no mandan un dato nuevo, se conserva el existente
    const status = orderUpdate.status === undefined ? orderFound.status : orderUpdate.status;
    const deliveryId = orderUpdate.deliveryId === undefined ? orderFound.deliveryId : orderUpdate.deliveryId;

    const dbRequest = await pool.query(
        `UPDATE orders SET status = $1, delivery_id = $2 
        WHERE id = $3 
        RETURNING id, status, total_price as "totalPrice", address, payment_method as "paymentMethod", 
        order_detail as "orderDetail", consumer_id as "consumerId", 
                store_id as "storeId", delivery_id as "deliveryId"`,
        [status, deliveryId, orderId]
    );

    return dbRequest.rows[0];
};

export const deleteOrderService = async (
    orderId: number,
    consumerId: string
): Promise<void> => {
    const orderFound = await getOrderByIdService(orderId);

    // Validaciones de seguridad
    if (orderFound.consumerId !== consumerId) {
        throw Boom.forbidden('You can only delete your own orders');
    }

    if (orderFound.status !== OrderStatus.PENDING) {
        throw Boom.badRequest(
            'Cannot delete an order that has already been processed by the store'
        );
    }

    // Eliminar primero los productos por la Foreign Key
    await pool.query('DELETE FROM order_products WHERE order_id = $1', [
        orderFound.id,
    ]);

    // Eliminar la orden
    await pool.query('DELETE FROM orders WHERE id = $1', [orderFound.id]);
};