import type { AuthResponse, AuthTokenResponsePassword } from "@supabase/supabase-js";
import type { AuthenticateUserDTO, CreateUserDTO } from "./auth.types.js";
import { supabase } from "../../config/supabase.js";
import Boom from "@hapi/boom";
import { UserRole } from "./auth.types.js";

// Autenticación del usuario
export const authenticateUserService = async (credentials: AuthenticateUserDTO): Promise<AuthTokenResponsePassword['data']> => {
    const signInRes = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    if (signInRes.error) {
        throw Boom.unauthorized(
            signInRes.error.message + ", the credentials do not match any user."
        );
    }

    return signInRes.data;
};

// Creación de usuario
export const createUserService = async (user: CreateUserDTO): Promise<AuthResponse['data']> => {
    // 1. Registro en Supabase Auth
    const signUpRes = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
            data: {
                username: user.username,
                role: user.role,
            },
        },
    });

    if (signUpRes.error) {
        throw Boom.badRequest(
            signUpRes.error.message + ', the user could not be created'
        );
    }

    const newUserId = signUpRes.data.user?.id;

    if (newUserId) {
        // 2. Inserción en la tabla pública de usuarios 
        const { error: insertionError } = await supabase.from('users').insert([
            {
                id: newUserId,
                email: user.email,
                username: user.username, // Antes decía name
                role: user.role,
            },
        ]);

        if (insertionError) {
            throw Boom.internal(
                'The user profile could not be created. ' + insertionError.message
            );
        }

        // 3. Creación de la tienda si aplica 
        if (user.role === UserRole.STORE && user.storeName) {
            const { error: storeError } = await supabase.from('stores').insert([
                {
                    store_name: user.storeName, // Antes decía name
                    owner_id: newUserId,
                    status: 'closed',
                    description: 'Descripción pendiente', 
                },
            ]);

            if (storeError) {
                throw Boom.internal(
                    'User created, but failed to create store: ' + storeError.message
                );
            }
        }
    }

    return signUpRes.data;
};