import { Router, type Router as ExpressRouter } from "express";
import { AuthController } from "./auth.controller.js";

const router: ExpressRouter = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

export default router;
