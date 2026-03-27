import dotenv from 'dotenv'; // la libreria dotenv busca el archivo .env de mi proyecto

dotenv.config(); // toma lo de ese archivo y lo inyecta en node.js(process.env)

export const PORT = process.env.PORT || 3000;  //Si no tienes un numero especificado de puerto, entonces la alternativa es el puerto 3000
//el operador || es como un plan b.
export const NODE_ENV = process.env.NODE_ENV || "development" // estado en el que se encuentra. Cuando es production ya esta desplegado

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = Number(process.env.DB_PORT || 6543);
export const DB_USER = process.env.DB_USER || 'postgrees';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
export const DB_NAME = process.env.DB_NAME || 'mydatabase';

export const SUPABASE_URL = process.env.SUPABASE_URL || ''
export const SUPABASE_KEY = process.env.SUPABASE_KEY || ''
