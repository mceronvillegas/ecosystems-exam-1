import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import { supabase } from '../config/supabase.js'; 
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

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.headers.authorization) {
            throw Boom.unauthorized('Authorization header is missing');
        }

        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            throw Boom.unauthorized('Token is missing');
        }

        const userResponse = await supabase.auth.getUser(token);

        if (userResponse.error) {
            throw Boom.unauthorized(userResponse.error.message);
        }

        req.user = userResponse.data.user;
        next(); 
    } catch (error) {
        next(error); 
    }
};


export const checkRole = (allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        const userRole = user?.user_metadata?.role;

        if (userRole === undefined || !allowedRoles.includes(userRole)) {
            throw Boom.forbidden(
                `Request Denied. Users with a '${userRole}' Role cannot make a request for this function`
            );
        }

        next();
    };
};

