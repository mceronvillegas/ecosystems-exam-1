import { Pool } from 'pg' //se importa la herramienta pool. Abre, mantiene y recicla multiples coneciones a la db
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./index.js"; //traemos las variables desde nuestro archivo principal index.ts

export const pool = new Pool({ 
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
});
