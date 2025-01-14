import express from "express";
import { create } from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import favicon from "serve-favicon";

import router from "./sis/routes/routes.js";
import config from "./sis/config/config.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up handlebars engine
const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
});

// Set handlebars as the view engine
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(favicon(path.join(__dirname, "assets", "img", "favicon.ico")));

app.use("/", router);

// Routes
app.get("/", (req, res) => {
  res.render("home/home");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard/dashboard");
});

app.get("/users", (req, res) => {
  res.render("users/users");
});

app.get("/products", (req, res) => {
  res.render("products/products");
});

app.get("/news", (req, res) => {
  res.render("news/news");
});

// Start the server
const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on: \nhttp://localhost:${PORT}`);
});

export default app;
