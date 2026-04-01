import type { AuthResponse, AuthTokenResponsePassword } from "@supabase/supabase-js";
import type { AuthenticateUserDTO, CreateUserDTO } from "./auth.types.js";
import { supabase } from "../../config/supabase.js";
import Boom from "@hapi/boom";
import { UserRole } from "./auth.types.js";

//autenticacion del usuario
export const authenticateUserService = async (credentials: AuthenticateUserDTO 
): Promise<AuthTokenResponsePassword['data']> => { //libreria de supabase
    const signInRes = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    if (signInRes.error) {
        throw Boom.unauthorized(
            signInRes.error.message + ", the credentials does not match any user."
        );
    }

    return signInRes.data;
};

//creacion de usuario
export const createUserService = async (user: CreateUserDTO
): Promise<AuthResponse['data']> => {
    // Llama al método de Supabase para registrar al usuario y espera la respuesta
    const signUpRes = await supabase.auth.signUp({
        email: user.email, // Credencial obligatoria: correo
        password: user.password, // Credencial obligatoria: contraseña
        options: {
            data: {
                username: user.username,
                role: user.role,
            },
        },
    });
    // Verifica si la respuesta de Supabase contiene algún error
    if (signUpRes.error) {
        // Interrumpe el flujo y lanza un error HTTP 400 (Bad Request) usando Boom
        throw Boom.badRequest(
            signUpRes.error.message + ', the user could not be created'
        );
    }

    //id del nuevo usuario
    const newUserId = signUpRes.data.user?.id; //si existe un usuario entonces que nos de el id alternativo de supabase
    if (newUserId) {
        const { error: insertionError } = await supabase.from('users').insert([ // ese from users es insertar el nombre de la tabla que tenemos en supabase
            {
                id: newUserId,
                email: user.email,
                name: user.username,
                role: user.role,
            },
        ]);

        if (insertionError) {
            throw Boom.internal(
                'The user profile could not be created' + insertionError.message
            );
        }

        if (user.role === UserRole.STORE && user.storeName) {
            const { error: storeError } = await supabase.from('stores').insert([
                {
                    name: user.storeName,
                    owner_id: newUserId,
                    status: 'closed',
                },
            ]);

            if (storeError) {
                throw Boom.internal(
                    'User created, but failed to create store: ' + storeError.message
                );
            }
        }


    }


    // Si no hubo errores, retorna la información (data) del nuevo usuario
    return signUpRes.data;
};

