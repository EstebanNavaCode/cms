import { Router } from "express";
import { login, registerUser } from "../../src/controllers/user.controller.js"; 
import { registerProduct ,getCategories, getSubcategories} from "../../src/controllers/products.controller.js";

const router = Router();

router.post("/", login);
router.post("/users", registerUser);
router.get('/categories', getCategories); // Ruta para obtener categorías
router.get('/subcategories/:categoryId', getSubcategories);
router.post("/products", registerProduct);

export default router;
