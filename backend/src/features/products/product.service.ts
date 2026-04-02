import { pool } from '../../config/database.js';
import Boom from '@hapi/boom';
import type { Product, CreateProductDTO, UpdateProductDTO } from './product.types.js';

// Obtener todos los productos y filtrar por tienda
export const getProductsService = async (storeId?: number): Promise<Product[]> => {
    let query = 'SELECT id, name, price, store_id as "storeId" FROM products';
    const params: any[] = [];

    // Si nos pasan un storeId se filtra solo los de esa tienda
    if (storeId) {
        query += ' WHERE store_id = $1';
        params.push(storeId);
    }

    const dbRequest = await pool.query(query, params);
    return dbRequest.rows;
};

// Obtener un producto por su ID
export const getProductByIdService = async (productId: number): Promise<Product> => {
    const dbRequest = await pool.query(
        'SELECT id, name, price, store_id as "storeId" FROM products WHERE id = $1',
        [productId]
    );

    if (dbRequest.rowCount === 0) {
        throw Boom.notFound('Product not found');
    }

    return dbRequest.rows[0];
};

// Crear un nuevo producto
export const createProductService = async (product: CreateProductDTO): Promise<Product> => {
    const dbRequest = await pool.query(
        `INSERT INTO products (name, price, store_id) 
        VALUES ($1, $2, $3) 
        RETURNING id, name, price, store_id as "storeId"`,
        [product.name, product.price, product.storeId]
    );

    return dbRequest.rows[0];
};

// Actualizar un producto solo precio
export const updateProductService = async (
    productId: number,
    productUpdate: UpdateProductDTO
): Promise<Product> => {
    // existe?
    const productFound = await getProductByIdService(productId);

    // Si no mandan precio nuevo conservo viejo
    const price = productUpdate.price === undefined ? productFound.price : productUpdate.price;

    const dbRequest = await pool.query(
        `UPDATE products SET price = $1 
        WHERE id = $2 
        RETURNING id, name, price, store_id as "storeId"`,
        [price, productId]
    );

    return dbRequest.rows[0];
};

export const deleteProductService = async (productId: number, storeId: number): Promise<void> => {
    const productFound = await getProductByIdService(productId);

    // pertenece a tienda?
    if (productFound.storeId !== storeId) {
        throw Boom.forbidden('You cannot remove a product that does not belong in your store');
    }

    // 3. Si todo está biense borra
    await pool.query('DELETE FROM products WHERE id = $1', [productId]);
};