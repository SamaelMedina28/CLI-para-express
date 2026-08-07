export function generateRoutes(modelName: string): string {
    const modelLower = modelName.charAt(0).toLowerCase() + modelName.slice(1);

    return `import { Router } from "express";
import { ${modelName}Controller } from "@controllers/${modelLower}.controller.js";
import { create${modelName}Schema, update${modelName}Schema } from "@schemas/${modelLower}.schema.js";
import { validateBody } from "@middlewares/validate.middleware.js";

const router = Router();

router.get("/", ${modelName}Controller.index);
router.get("/:id", ${modelName}Controller.getById);
router.post("/", validateBody(create${modelName}Schema), ${modelName}Controller.store);
router.put("/:id", validateBody(update${modelName}Schema), ${modelName}Controller.update);
router.delete("/:id", ${modelName}Controller.delete);

export default router;
`;
}
