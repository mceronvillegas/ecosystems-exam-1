import axios from "axios"; //Importa la librería Axios, que nos permite comunicarnos con servidores a través de internet (hacer peticiones HTTP).

export const apiClient = axios.create({ //Crea una versión "personalizada" de Axios llamada apiClient y la exporta para usarla en otros archivos.
    baseURL: "https://ecosystems-exam-1.vercel.app/api" //link de la api(backend)
});

apiClient.interceptors.request.use( //Activa un interceptor que atrapará todas las peticiones que salgan usando apiClient antes de que viajen al servidor.
    (config) => { //contiene toda la información de la petición
        const accessToken = localStorage.getItem("access_token"); //Busca en la memoria local del navegador (el localStorage) si existe una "llave" guardada bajo el nombre "access_token".

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            //Si hay una llave, la "pega" en los encabezados (headers) de la petición para demostrarle al servidor que tienes permiso de entrar.
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getCurrentUser = () => { //exporta funcion
    const storedUserString = localStorage.getItem("user");//busca en el navegador los datos del usuario
    
    if (!storedUserString) return null;

    try {
        return JSON.parse(storedUserString);
    } catch {
        return null;
    }
};