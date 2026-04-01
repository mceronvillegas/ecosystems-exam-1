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

export type Order = { 
    id: number;
    status: OrderStatus;
    totalPrice: number;
    orderDetail: string;
    address: string; 
    consumerId: string; 
    storeId: number;
    deliveryId?: string | null;
    products?: OrderProduct[];
    paymentMethod: string;
}

export interface CreateOrderDTO {
    // orderId eliminado (lo genera la DB)
    storeId: number; //  a qué tienda se le pide
    address: string; 
    paymentMethod: string;
    orderDetail: string;
    totalPrice: number;
    products: { 
        productId: number;
        quantity: number;
    }[];
}

export interface UpdateOrderStatusDTO {
    status: OrderStatus;
    deliveryId?: string;
}