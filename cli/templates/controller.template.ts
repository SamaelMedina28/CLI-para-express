// cli/templates/controller.template.ts
export function generateController(modelName: string) {
    const model = modelName; // ej. "User"
    const modelLower = modelName.charAt(0).toLowerCase() + modelName.slice(1); // "user"

    return `
import type { Request, Response, NextFunction } from "express";
import { ${model}Service } from "./${modelLower}.service.js";
import ${model} from "../models/${modelLower}.js";

export const ${model}Controller = {
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const ${modelLower}s = await ${model}Service.getAll();
            res.json(${modelLower}s);
        } catch (err) {
            next(err);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const ${modelLower} = await ${model}Service.getById(Number(req.params.id));
            res.json(${modelLower});
        } catch (err) {
            next(err);
        }
    },

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const ${modelLower} = await ${model}Service.create(req.body);
            res.status(201).json(${modelLower});
        } catch (err) {
            next(err);
        }
    },
};
`;
}
