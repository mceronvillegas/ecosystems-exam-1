import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import { supabase } from '../config/supabase.js'; // <-- Ojo: agregué el .js al final
import type { AuthUser } from '@supabase/supabase-js';

// 1. Extendemos el Request para que acepte al usuario
export interface AuthenticatedRequest extends Request {
    user?: AuthUser;
}

export const getUserFromRequest = (req: AuthenticatedRequest): AuthUser => {
    if (req.user) {
        return req.user;
    }
    throw Boom.unauthorized('User not authenticated');
};

// 2. El Guardia de Seguridad (Añadimos try/catch)
export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.headers.authorization) {
            throw Boom.unauthorized('Authorization header is missing');
        }

        // Extraemos el token del formato "Bearer <token>"
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            throw Boom.unauthorized('Token is missing');
        }

        // Validamos con Supabase
        const userResponse = await supabase.auth.getUser(token);

        if (userResponse.error) {
            throw Boom.unauthorized(userResponse.error.message);
        }

        // Le ponemos el gafete al request
        req.user = userResponse.data.user;
        next(); // ¡Pásale!
    } catch (error) {
        next(error); // Lo mandamos a tu errorsMiddleware
    }
};

// 3. El validador de roles (Este no necesita try/catch porque no es asíncrono)
export const checkRole = (allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        // Extraemos el rol que guardamos en data al momento del registro
        const userRole = user?.user_metadata?.role;

        if (userRole === undefined || !allowedRoles.includes(userRole)) {
            throw Boom.forbidden(
                `Request Denied. Users with a '${userRole}' Role cannot make a request for this function`
            );
        }

        next();
    };
};

