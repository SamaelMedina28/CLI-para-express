import { Router, type Router as ExpressRouter } from "express";
import { LibroController } from "./libro.controller.js";

const router: ExpressRouter = Router();

router.get("/", LibroController.index);
router.get("/:id", LibroController.getById);
router.post("/", LibroController.store);
router.put("/:id", LibroController.update);
router.delete("/:id", LibroController.delete);

export default router;
