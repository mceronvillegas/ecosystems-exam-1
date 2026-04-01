export enum OrderStatus {
    // pedido en estado inicial
    PENDING = "pending",
    // estado en la tienda
    DECLINED = "declined",
    ACCEPTED = "accepted",
    //repartidores
    PICKED = "picked",
    ARRIVED = "arrived"
}

export type OrderProduct = { //solamente van las caracteristicas de lo que es el producto
    id: number;
    orderId: number;
    quantity: number;
    productId: number;
}

export type order = { 
    id: number,

    status: OrderStatus;

    totalPrice: number;

    orderDetail: string;
    adress: string;
    
    consumerId: number;
    storeId: number;
    deliveryId?: string | null; //Este item es asignado despues de que se hace la orden

    products?: OrderProduct[]; //los corchetes son  
    paymentMethod: string;
}

export interface CreateOrderDTO {
    orderId: number;
    adress: string;
    paymentMethod: string;
    orderDetail: string;
    totalPrice: number;

    Products: {
        productId: number;
        quantity: number;
    }[];
}

export interface UpdateOrderStatusDTO {
    status: OrderStatus;
    deliveryId?: string;
}
