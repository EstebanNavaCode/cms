import fs from "fs";
import path from "path";
import { getConnection } from "../../sis/database/conection.js";
import sql from "mssql";

export const registerProduct = async (req, res) => {
  try {
    const {
      NOMBRE_LIB,
      AUTOR_LIB,
      EDITORIAL_LIB,
      CATEGORIA_LIB,
      SUBCATEGORIA_LIB,
      ISBN_LIB,
      STOCK_LIB,
    } = req.body;
    const imgFile = req.files?.IMG_LIB;

    if (
      !NOMBRE_LIB ||
      !AUTOR_LIB ||
      !EDITORIAL_LIB ||
      !CATEGORIA_LIB ||
      !SUBCATEGORIA_LIB ||
      !ISBN_LIB ||
      !STOCK_LIB
    ) {
      return res.status(400).json({
        message: "Todos los campos obligatorios deben ser proporcionados.",
      });
    }

    let imgFilename = null;
    if (imgFile) {
      const uploadDir = path.join(process.cwd(), "uploads/products");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      imgFilename = ISBN_LIB.replace(/[@.]/g, "_") + path.extname(imgFile.name);
      const uploadPath = path.join(uploadDir, imgFilename);
      await imgFile.mv(uploadPath);
    }

    const pool = await getConnection();
    await pool
      .request()
      .input("NOMBRE_LIB", sql.NVarChar(300), NOMBRE_LIB)
      .input("AUTOR_LIB", sql.NVarChar(300), AUTOR_LIB)
      .input("EDITORIAL_LIB", sql.NVarChar(300), EDITORIAL_LIB)
      .input("CATEGORIA_LIB", sql.Int, CATEGORIA_LIB)
      .input("SUBCATEGORIA_LIB", sql.Int, SUBCATEGORIA_LIB)
      .input("ISBN_LIB", sql.NVarChar(300), ISBN_LIB)
      .input("STOCK_LIB", sql.Int, STOCK_LIB)
      .input(
        "IMG_LIB",
        sql.NVarChar(300),
        imgFilename ? `/uploads/products/${imgFilename}` : null
      ).query(`
                INSERT INTO LIB_T_ (NOMBRE_LIB, AUTOR_LIB, EDITORIAL_LIB, CATEGORIA_LIB, SUBCATEGORIA_LIB, ISBN_LIB, STOCK_LIB, IMG_LIB)
                VALUES (@NOMBRE_LIB, @AUTOR_LIB, @EDITORIAL_LIB, @CATEGORIA_LIB, @SUBCATEGORIA_LIB, @ISBN_LIB, @STOCK_LIB, @IMG_LIB)
            `);

    res.status(201).json({ message: "Producto registrado exitosamente." });
  } catch (error) {
    console.error("Error al registrar producto:", error);
    res.status(500).json({ message: "Error al registrar producto." });
  }
};

export const getCategories = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(
        "SELECT ID_LCAT, NOMBRE_LCAT FROM CATEGORIA_LIB_T WHERE ACTIVO_LCAT = 1"
      );

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).send("Error al obtener categorías.");
  }
};

export const getSubcategories = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId || isNaN(categoryId)) {
    return res
      .status(400)
      .json({ error: "El parámetro 'categoryId' debe ser un número válido." });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("categoryId", sql.Int, parseInt(categoryId))
      .query(
        "SELECT ID_SBC, NOMBRE_SBC FROM SUBCATEGORIA_LCAT_T WHERE ACTIVO_SBC = 1 AND ID_LCAT = @categoryId"
      );

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener subcategorías:", error);
    res.status(500).send("Error al obtener subcategorías.");
  }
};

export const getProducts = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
          LIB_T_.ID_LIB,
          LIB_T_.NOMBRE_LIB,
          LIB_T_.AUTOR_LIB,
          LIB_T_.EDITORIAL_LIB,
          LIB_T_.ISBN_LIB,
          LIB_T_.STOCK_LIB,
          LIB_T_.ACTIVO_LIB,
          CATEGORIA_LIB_T.NOMBRE_LCAT AS CATEGORIA,
          SUBCATEGORIA_LCAT_T.NOMBRE_SBC AS SUBCATEGORIA,
          LIB_T_.IMG_LIB  
      FROM LIB_T_
      LEFT JOIN CATEGORIA_LIB_T ON LIB_T_.CATEGORIA_LIB = CATEGORIA_LIB_T.ID_LCAT
      LEFT JOIN SUBCATEGORIA_LCAT_T ON LIB_T_.SUBCATEGORIA_LIB = SUBCATEGORIA_LCAT_T.ID_SBC;
    `);

    res.render("products/products", { products: result.recordset });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res
      .status(500)
      .json({ message: "Error al obtener la lista de productos." });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      NOMBRE_LIB,
      AUTOR_LIB,
      EDITORIAL_LIB,
      ISBN_LIB,
      STOCK_LIB,
      CATEGORIA_LIB,
      SUBCATEGORIA_LIB,
      ACTIVO_LIB,
    } = req.body;
    const imgFile = req.files?.IMG_LIB;

    if (!id) {
      return res.status(400).json({ message: "ID del producto es requerido." });
    }

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("ID_LIB", sql.Int, id)
      .query("SELECT ACTIVO_LIB, IMG_LIB FROM LIB_T_ WHERE ID_LIB = @ID_LIB");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    let estadoProducto = result.recordset[0].ACTIVO_LIB;
    if (ACTIVO_LIB !== undefined) {
      estadoProducto = ACTIVO_LIB === "1" ? 1 : 0;
    }

    let imgFilename = result.recordset[0]?.IMG_LIB || null;

    if (imgFile) {
      const uploadDir = path.join(process.cwd(), "uploads/products");

      if (imgFilename) {
        const oldImagePath = path.join(uploadDir, path.basename(imgFilename));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      imgFilename = ISBN_LIB.replace(/[@.]/g, "_") + path.extname(imgFile.name);
      const uploadPath = path.join(uploadDir, imgFilename);
      await imgFile.mv(uploadPath);

      imgFilename = `/uploads/products/${imgFilename}`;
    }

    await pool
      .request()
      .input("ID_LIB", sql.Int, parseInt(id, 10))
      .input("NOMBRE_LIB", sql.NVarChar(300), NOMBRE_LIB)
      .input("AUTOR_LIB", sql.NVarChar(300), AUTOR_LIB)
      .input("EDITORIAL_LIB", sql.NVarChar(300), EDITORIAL_LIB)
      .input("ISBN_LIB", sql.NVarChar(300), ISBN_LIB)
      .input("STOCK_LIB", sql.Int, STOCK_LIB)
      .input("CATEGORIA_LIB", sql.Int, CATEGORIA_LIB)
      .input("SUBCATEGORIA_LIB", sql.Int, SUBCATEGORIA_LIB)
      .input("ACTIVO_LIB", sql.Bit, estadoProducto)
      .input("IMG_LIB", sql.NVarChar(300), imgFilename).query(`
              UPDATE LIB_T_
              SET 
                  NOMBRE_LIB = @NOMBRE_LIB,
                  AUTOR_LIB = @AUTOR_LIB,
                  EDITORIAL_LIB = @EDITORIAL_LIB,
                  ISBN_LIB = @ISBN_LIB,
                  STOCK_LIB = @STOCK_LIB,
                  CATEGORIA_LIB = @CATEGORIA_LIB,
                  SUBCATEGORIA_LIB = @SUBCATEGORIA_LIB,
                  ACTIVO_LIB = @ACTIVO_LIB,
                  IMG_LIB = @IMG_LIB
              WHERE ID_LIB = @ID_LIB
          `);

    res.json({ message: "Producto actualizado correctamente." });
  } catch (error) {
    console.error("⚠️ Error al actualizar producto:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al actualizar el producto." });
  }
};
