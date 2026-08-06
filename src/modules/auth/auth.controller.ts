import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import type { AuthenticatedRequest } from "@src/middlewares/auth.middleware.js";

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

            const { user, token } = await AuthService.login({ email, password });

            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000, // 1 dia
            });

            res.json({ message: "Inicio de sesión exitoso", user });
        } catch (err: any) {
            res.status(401).json({ message: err.message || "Error al iniciar sesión" });
        }
    },

    async logout(req: Request, res: Response) {
        try {
            res.clearCookie("jwt");
            res.json({ message: "Cierre de sesión exitoso" });
        } catch (err: any) {
            res.status(500).json({ message: "Error al cerrar sesión" });
        }
    },

    me(req: AuthenticatedRequest, res: Response) {
        try {
            res.json(req.user);
        } catch (err: any) {
            res.status(500).json({ message: "Error al obtener el usuario" });
        }
    }
};
