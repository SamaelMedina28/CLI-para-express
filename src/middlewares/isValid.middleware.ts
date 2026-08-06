import type { Request, Response, NextFunction } from "express";

// Extender la interfaz Request de Express para adjuntar el usuario decodificado
export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}


export function isValidMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        // TODO: Lógica del middleware isValid
        console.log("Middleware isValid ejecutado");
        next();
    } catch (err) {
        next(err);
    }
}
