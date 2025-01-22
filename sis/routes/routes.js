import { Router } from "express";
import {
  login,
  registerUser,
  getUsers,
  editUser,
} from "../../src/controllers/user.controller.js";

import {
  registerProduct,
  getCategories,
  getSubcategories,
  getProducts,
  editProduct,
} from "../../src/controllers/products.controller.js";

import {
  getCategoriesNEWS,
  getSubcategoriesNEWS,
  registerNews,
  getNews,
} from "../../src/controllers/news.controller.js";

const router = Router();

router.post("/", login);
router.post("/users", registerUser);
router.put("/users/:id", editUser);
router.get("/users", getUsers);

router.post("/products", registerProduct);
router.get("/products", getProducts);
router.put("/products/:id", editProduct);



router.get("/categories", getCategories);
router.get("/subcategories/:categoryId", getSubcategories);

router.post("/news", registerNews);
router.get("/news", getNews);

router.get("/categoriesNEWS", getCategoriesNEWS);
router.get("/subcategoriesNEWS/:categoryId", getSubcategoriesNEWS);

export default router;
