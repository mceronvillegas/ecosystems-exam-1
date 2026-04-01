export enum UserRole { // te deja enumerar una serie de constantes que tendran un valor asignado
    CONSUMER = "consumer",
    STORE = "store",
    DELIVERY = "delivery"
}

export type User = {
    id: number;
    username: string;
    password: string;
    email: string;
    role: UserRole; 
};

export interface CreateUserDTO { //crear un tipado especifico solo para la creacion de usuarios
    username: string;
    password: string;
    email: string;
    role: UserRole;
    storeName?: string;
}

export interface AuthenticateUserDTO { 
    password: string;
    email: string;
}

