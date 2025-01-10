import { Router } from "express";
import { renderHomeWithUsers } from "../../src/controllers/user.controller.js"; // Adjusted path to the controller

const router = Router();

router.get("/", renderHomeWithUsers);

export default router;
