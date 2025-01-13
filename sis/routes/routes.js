import { Router } from "express";
import { login, registerUser } from "../../src/controllers/user.controller.js"; // Adjusted path to the controller

const router = Router();

router.post("/", login);
router.post("/users", registerUser);

export default router;
