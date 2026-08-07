import type { Request, Response, NextFunction } from "express";
import { ProductoService } from "@src/modules/producto/producto.service.js";

export const ProductoController = {
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const productos = await ProductoService.getAll();
            res.json(productos);
        } catch (err) {
            next(err);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const producto = await ProductoService.getById(Number(req.params.id));
            if (!producto) {
                return res.status(404).json({ message: "Producto not found" });
            }
            res.json(producto);
        } catch (err) {
            next(err);
        }
    },

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const producto = await ProductoService.create(req.body);
            res.status(201).json(producto);
        } catch (err) {
            next(err);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const producto = await ProductoService.update(Number(req.params.id), req.body);
            res.json(producto);
        } catch (err) {
            next(err);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await ProductoService.delete(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
};
