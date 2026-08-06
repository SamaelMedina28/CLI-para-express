export function generateRoutes(modelName: string): string {
    const model = modelName;
    const modelLower = modelName.charAt(0).toLowerCase() + modelName.slice(1);

    return `import { Router, type Router as ExpressRouter } from "express";
import { ${model}Controller } from "./${modelLower}.controller.js";

const router: ExpressRouter = Router();

router.get("/", ${model}Controller.index);
router.get("/:id", ${model}Controller.getById);
router.post("/", ${model}Controller.store);
router.put("/:id", ${model}Controller.update);
router.delete("/:id", ${model}Controller.delete);

export default router;
`;
}
