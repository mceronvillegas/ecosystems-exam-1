export enum StoreStatus {
    OPEN = 'open',
    CLOSED = 'closed',
}

export type Store = {
    id: number;
    storeName: string;
    description: string;

    status: StoreStatus;
    ownerId: number;
}

export interface createStoreDTO {
    name: string;
}

export interface UpdateStoreDTO {
    status?: StoreStatus;
}