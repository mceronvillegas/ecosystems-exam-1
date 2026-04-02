import express from "express";
import cors from "cors";
import { PORT, NODE_ENV } from "./config/index.js";
import { authRouter } from "./features/auth/auth.router.js";
import { orderRouter } from "./features/order/order.router.js";
import { storeRouter } from "./features/stores/store.router.js";
import { productRouter } from "./features/products/product.router.js";
import { errorsMiddleware } from "./middlewares/errorsMiddleware.js";

//Express config
const app = express();
app.use(express.json()) //Las respuestas van a pasar a ser un json.
app.use(cors());

//feature routes
app.use('/api/auth', authRouter); // todas las rutas definidas dentro de apiRouter solo se activarán si la URL comienza con /api.
app.use('/api/products', productRouter);
app.use('/api/stores', storeRouter);
app.use('/api/orders', orderRouter); //quiero llorar demasiado

// Main route
app.get("/", (req, res) => {
    res.send("Hello, World!. This server is up");
});

app.use(errorsMiddleware) // funcion de express para usar

//app env
if (NODE_ENV !== "production") { // Si el env de node no es produccion, entonces correra en el puerto propuesto en la confug del index.ts
    app.listen(PORT, () => { // Escucha las conexiones que se estan haciendo, es un callback en donde puedes mostrar la direccion donde el servidor se esta desplegando
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;


