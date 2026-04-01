export type Product = {
    id: number;
    name: string;
    price: number;

    storeId: number;
}

export interface CreateProductDTO {
    name: string;
    price: number;
    storeId: number;
}

export interface UpdateProductDTO {
    price?: number;
}