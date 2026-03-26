import Express, { Router } from "express";
import { PORT, NODE_ENV } from "./config/index.js";
import { authRouter } from "./features/auth/auth.router.js";


const app = Express();
app.use(Express.json) //Las respuestas van a pasar a ser un json.


app.use('/api/auth', authRouter); // todas las rutas definidas dentro de apiRouter solo se activarán si la URL comienza con /api.


app.get("/", (req, res) => {
    res.send("Hello, World!. This server is up");
});

if (NODE_ENV !== "production") { // Si el env de node no es produccion, entonces correra en el puerto propuesto en la confug del index.ts
    app.listen(PORT, () => { // Escucha las conexiones que se estan haciendo, es un callback en donde puedes mostrar la direccion donde el servidor se esta desplegando
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;


