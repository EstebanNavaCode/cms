import { Router } from "express";
import { login, registerUser,getUsers } from "../../src/controllers/user.controller.js"; 
import { registerProduct ,getCategories, getSubcategories} from "../../src/controllers/products.controller.js";
import { getCategoriesNEWS, getSubcategoriesNEWS, registerNews } from "../../src/controllers/news.controller.js";

const router = Router();

router.post("/", login);
router.post("/users", registerUser);
router.get("/users", getUsers);

router.post("/products", registerProduct);
router.get('/categories', getCategories); 
router.get('/subcategories/:categoryId', getSubcategories);

router.post("/news",registerNews)
router.get('/categoriesNEWS', getCategoriesNEWS);
router.get('/subcategoriesNEWS/:categoryId', getSubcategoriesNEWS);


export default router;
