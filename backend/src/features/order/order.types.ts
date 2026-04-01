export enum OrderStatus {
    // estado inicial
    PENDING = "pending",
    // estado en la tienda
    DECLINED = "declined",
    ACCEPTED = "accepted",
    // repartidores
    PICKED = "picked",
    ARRIVED = "arrived"
}

export type OrderProduct = {
    id: number;
    orderId: number;
    quantity: number;
    productId: number;
}

// Cambiado a mayúscula inicial (Convención de Typescript)
export type Order = { 
    id: number;
    status: OrderStatus;
    totalPrice: number;
    orderDetail: string;
    address: string; // Corregido: address
    consumerId: string; // Corregido: string porque es un UUID
    storeId: number;
    deliveryId?: string | null;
    products?: OrderProduct[];
    paymentMethod: string;
}

export interface CreateOrderDTO {
    // orderId eliminado (lo genera la DB)
    storeId: number; // Añadido: vital saber a qué tienda se le pide
    address: string; // Corregido: address
    paymentMethod: string;
    orderDetail: string;
    totalPrice: number;
    products: { // Corregido: minúscula
        productId: number;
        quantity: number;
    }[];
}

export interface UpdateOrderStatusDTO {
    status: OrderStatus;
    deliveryId?: string;
}