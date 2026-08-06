import { Router, type Router as ExpressRouter } from "express";
import { UserController } from "./user.controller.js";

const router: ExpressRouter = Router();

router.get("/", UserController.index);
router.get("/:id", UserController.getById);
router.post("/", UserController.store);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.delete);

export default router;
