export function generateMiddleware(name: string): string {
    const nameLower = name.charAt(0).toLowerCase() + name.slice(1);

    return `import type { Request, Response, NextFunction } from "express";

// Extender la interfaz Request de Express para adjuntar el usuario decodificado
export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}


export function ${nameLower}Middleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        // TODO: Lógica del middleware ${name}
        console.log("Middleware ${name} ejecutado");
        next();
    } catch (err) {
        next(err);
    }
}
`;
}