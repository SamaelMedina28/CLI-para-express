import express, { type Application } from "express";
import apiRouter from "./routes/index.js";

const app: Application = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Montaje de las rutas principales (ej: http://localhost:3000/api/users)
app.use("/api", apiRouter);

// Manejo básico de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default app;
