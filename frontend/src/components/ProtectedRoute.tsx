import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../api/client";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole: string;
}

export default function ProtectedRoute({
    children,
    allowedRole,
}: ProtectedRouteProps) {
    const user = getCurrentUser();

    // 1. Si no hay usuario, mandamos al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Si el rol no coincide con el permitido, lo mandamos a su propia ruta
    if (user.role !== allowedRole) {
        return <Navigate to={`/${user.role}`} replace />;
    }

    // 3. ¡Aquí estaba el error! Debe decir {children} dentro de las etiquetas <>
    return <>{children}</>;
}