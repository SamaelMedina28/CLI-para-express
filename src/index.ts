import express, { type Express, type Request, type Response } from "express";
import "dotenv/config";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hola mundo" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
