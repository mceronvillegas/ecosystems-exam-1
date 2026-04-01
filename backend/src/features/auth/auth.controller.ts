import Boom from "@hapi/boom";
import type { Request, Response, NextFunction } from "express"; 
import { authenticateUserService, createUserService } from "./auth.service.js";
import { UserRole } from "./auth.types.js";

export const authenticateUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.body) {
            throw Boom.badRequest('Request body is required');
        }

        const { email, password } = req.body;

        if (email === undefined) {
            throw Boom.badRequest('Email is required');
        }

        if (password === undefined) {
            throw Boom.badRequest('Password is required');
        }

        const user = await authenticateUserService({ email, password });
        res.json(user); 
        } catch (error) {
        next(error); // si algo falla se le pasa a errors middleware
    }
};

export const createUserController = async (
    req: Request,
    res: Response,
    next: NextFunction 
) => {
    try {
        if (!req.body) {
            throw Boom.badRequest('Request body is required');
        }

        const { email, password, username, role, storeName } = req.body;

        if (email === undefined) {
            throw Boom.badRequest('Email is required');
        }
        if (password === undefined) {
            throw Boom.badRequest('Password is required');
        }
        if (username === undefined) {
            throw Boom.badRequest('Username is required');
        }

        if (!Object.values(UserRole).includes(role)) {
            throw Boom.badRequest(
                `Role must be one of: ${Object.values(UserRole).join(',')}`
            );
        }

        if (role === UserRole.STORE && storeName === undefined) {
            throw Boom.badRequest('Store name is required');
        }
                    
        const user = await createUserService({
            email,
            username,
            password,
            role,
            storeName, 
        });

        res.status(201).json(user);
    } catch (error) {
        next(error); 
        }
}