import { Router } from "express";
import { login} from "../../src/controllers/user.controller.js"; // Adjusted path to the controller

const router = Router();

router.post("/", login); // Usa la función `login` del controlador


export default router;
