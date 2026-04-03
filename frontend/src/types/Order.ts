export type Order = { 
    id: number;
    status: "pending" | "accepted" | "declined" | "picked" | "arrived";
    totalPrice: number;
    orderDetail: string;
    address: string; 
    consumerId: string; 
    storeId: number;
    deliveryId?: string | null;
    products?: string | null;
    paymentMethod: string;
}