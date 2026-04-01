import { Router } from "express"; //Siempre se importa el router desde express
import { authenticateUserController, createUserController } from "./auth.controller.js";

export const authRouter = Router(); //creo las constantes y las exporto para utilizarlas en otros archivos
authRouter.post('/login', authenticateUserController); //Funcionalidades de la aplicacion de autentificacion
authRouter.post('/register', createUserController);


