import Boom from '@hapi/boom';
import { pool } from '../../config/database.js';
import type { Store, CreateStoreDTO, UpdateStoreDTO } from './store.types.js';
import { StoreStatus } from './store.types.js';

// obtiene todas las tiendas
export const getStoresService = async (): Promise<Store[]> => {
    const dbRequest = await pool.query(
        'SELECT id, store_name as "storeName", description, status, owner_id as "ownerId" FROM stores'
    );
    return dbRequest.rows;
};

// tienda por id
export const getStoreByIdService = async (storeId: number): Promise<Store> => {
    const dbRequest = await pool.query(
        'SELECT id, store_name as "storeName", description, status, owner_id as "ownerId" FROM stores WHERE id = $1',
        [storeId]
    );

    if (dbRequest.rowCount === 0) {
        throw Boom.notFound('Store not found');
    }

    return dbRequest.rows[0];
};

//tienda de usuario
export const getStoreByOwnerIdService = async (ownerId: string): Promise<Store> => {
    const dbRequest = await pool.query(
        'SELECT id, store_name as "storeName", description, status, owner_id as "ownerId" FROM stores WHERE owner_id = $1',
        [ownerId]
    );

    if (dbRequest.rowCount === 0) {
        throw Boom.notFound('This user does not have a store associated with them.');
    }

    return dbRequest.rows[0];
};

// crear tienda
export const createStoreService = async (
    store: CreateStoreDTO,
    ownerId: string
): Promise<Store> => {
    // Si recuerdas, tu base de datos pide que description sea NOT NULL. 
    // Si no mandan una, se pone un texto por defecto.
    const description = store.description || 'pending description';

    const dbRequest = await pool.query(
        `INSERT INTO stores (store_name, description, status, owner_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, store_name as "storeName", description, status, owner_id as "ownerId"`,
        [store.storeName, StoreStatus.OPEN, description, ownerId]
    );

    return dbRequest.rows[0];
};

// actualizar tienda
export const updateStoreService = async (
    storeData: UpdateStoreDTO,
    storeId: number,
    ownerId: string
): Promise<Store> => {
    // se busca tienda actual
    const currentStore = await getStoreByIdService(storeId);

    // es dueño?
    if (currentStore.ownerId !== ownerId) {
        throw Boom.forbidden('You are not the owner of this store');
    }

    // Si no mandan algo nuevo, conservamos lo que ya estaba
    const storeName = storeData.storeName ?? currentStore.storeName;
    const description = storeData.description ?? currentStore.description;
    const status = storeData.status ?? currentStore.status;

    //guardar cambios
    const dbRequest = await pool.query(
        `UPDATE stores 
        SET store_name = $1, description = $2, status = $3 
        WHERE id = $4 
        RETURNING id, store_name as "storeName", description, status, owner_id as "ownerId"`,
        [storeName, description, status, storeId]
    );

    return dbRequest.rows[0];
};

// elimine tienda
export const deleteStoreService = async (
    storeId: number,
    ownerId: string
): Promise<void> => {
    const store = await getStoreByIdService(storeId);

    // es dueño?
    if (store.ownerId !== ownerId) {
        throw Boom.forbidden('You are not the owner of this store');
    }

    await pool.query('DELETE FROM stores WHERE id = $1', [storeId]);
};