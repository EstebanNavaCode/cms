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
  editNews,
} from "../../src/controllers/news.controller.js";

const router = Router();

router.post("/", login);

//users routes
router.post("/users", registerUser);
router.get("/users", getUsers);
router.put("/users/:id", editUser);

//products routes
router.post("/products", registerProduct);
router.get("/products", getProducts);
router.get("/categories", getCategories);
router.get("/subcategories/:categoryId", getSubcategories);
router.put("/products/:id", editProduct);

//news routes
router.post("/news", registerNews);
router.get("/news", getNews);
router.get("/categoriesNEWS", getCategoriesNEWS);
router.get("/subcategoriesNEWS/:categoryId", getSubcategoriesNEWS);
router.put("/news/:id", editNews);

export default router;
