import { Router } from "express";
import { ProductoController } from "./producto.controller.js";
import { createProductoSchema, updateProductoSchema } from "./producto.schema.js";
import { validate } from "@middlewares/validate.middleware.js";

const router: Router = Router();

router.get("/", ProductoController.index);
router.get("/:id", ProductoController.getById);
router.post("/", validate(createProductoSchema), ProductoController.store);
router.put("/:id", validate(updateProductoSchema), ProductoController.update);
router.delete("/:id", ProductoController.delete);

export default router;
