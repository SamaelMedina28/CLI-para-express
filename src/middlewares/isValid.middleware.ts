import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/generics.js";



export function isValidMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        // TODO: Lógica del middleware isValid
        console.log("Middleware isValid ejecutado");
        next();
    } catch (err) {
        next(err);
    }
}
