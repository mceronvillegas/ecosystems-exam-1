export enum StoreStatus {
    OPEN = 'open',
    CLOSED = 'closed',
}

export type Store = {
    id: number;
    storeName: string;
    description: string;
    status: StoreStatus;
    ownerId: string; // string porque viene del UUID de Supabase
}

export interface CreateStoreDTO { 
    storeName: string; 
    description?: string; //  por si quieren enviarla
}

export interface UpdateStoreDTO {
    storeName?: string; // corregir su nombre
    description?: string; // actualizar su perfil
    status?: StoreStatus;
}