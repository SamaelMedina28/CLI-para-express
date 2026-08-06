import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";

export const AuthController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, name } = req.body;

            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: "Email y contraseña son obligatorios" });
            }

            const user = await AuthService.register({ email, password, name });
            res.status(201).json({
                message: "Usuario registrado con éxito",
                user,
            });
        } catch (err: any) {
            res.status(400).json({
                message: err.message || "Error al registrar usuario",
            });
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: "Email y contraseña son obligatorios" });
            }

            const result = await AuthService.login({ email, password });
            res.json({ message: "Inicio de sesión exitoso", ...result });
        } catch (err: any) {
            res.status(401).json({
                message: err.message || "Error al iniciar sesión",
            });
        }
    },
};
