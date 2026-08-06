import { Router, type Router as ExpressRouter } from "express";
import libroRoutes from "@src/modules/libro/libro.routes.js";

const apiRouter: ExpressRouter = Router();

// Registro de rutas por módulo
apiRouter.use("/libros", libroRoutes);

// Puedes añadir más módulos aquí a medida que los generes con Vane
// apiRouter.use("/products", productRoutes);

export default apiRouter;
