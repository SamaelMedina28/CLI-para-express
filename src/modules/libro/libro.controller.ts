import type { Request, Response, NextFunction } from "express";
import { LibroService } from "./libro.service.js";

export const LibroController = {
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const libros = await LibroService.getAll();
            res.json(libros);
        } catch (err) {
            next(err);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const libro = await LibroService.getById(Number(req.params.id));
            if (!libro) {
                return res.status(404).json({ message: "Libro not found" });
            }
            res.json(libro);
        } catch (err) {
            next(err);
        }
    },

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const libro = await LibroService.create(req.body);
            res.status(201).json(libro);
        } catch (err) {
            next(err);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const libro = await LibroService.update(Number(req.params.id), req.body);
            res.json(libro);
        } catch (err) {
            next(err);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await LibroService.delete(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
};
