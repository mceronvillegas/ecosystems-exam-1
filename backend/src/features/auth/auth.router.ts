import { Router } from "express"; //Siempre se importa el router desde express

export const authRouter = Router(); //creo las constantes y las exporto para utilizarlas en otros archivos
authRouter.post('/login'); //Funcionalidades de la aplicacion de autentificacion
authRouter.post('/register');


