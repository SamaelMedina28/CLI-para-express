import { Router } from "express";
import { ProductoController } from "@controllers/producto.controller.js";
import { createProductoSchema, updateProductoSchema } from "@schemas/producto.schema.js";
import { validateBody } from "@middlewares/validate.middleware.js";

const router = Router();

router.get("/", ProductoController.index);
router.get("/:id", ProductoController.getById);
router.post("/", validateBody(createProductoSchema), ProductoController.store);
router.put("/:id", validateBody(updateProductoSchema), ProductoController.update);
router.delete("/:id", ProductoController.delete);

export default router;
