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

    const IMG_LIB = req.file ? req.file.filename : null;

    console.log("Datos recibidos en el backend:", req.body);
    console.log("Archivo recibido:", req.file);

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

    const pool = await getConnection();

    await pool
      .request()
      .input("CATEGORIA_LIB", sql.Int, CATEGORIA_LIB)
      .input("SUBCATEGORIA_LIB", sql.Int, SUBCATEGORIA_LIB)
      .input("ISBN_LIB", sql.NVarChar(300), ISBN_LIB)
      .input("NOMBRE_LIB", sql.NVarChar(300), NOMBRE_LIB)
      .input("AUTOR_LIB", sql.NVarChar(300), AUTOR_LIB)
      .input("EDITORIAL_LIB", sql.NVarChar(300), EDITORIAL_LIB)
      .input("IMG_LIB", sql.NVarChar(300), IMG_LIB)
      .input("STOCK_LIB", sql.Int, STOCK_LIB)
      .input("ACTIVO_LIB", sql.Bit, 1).query(`
        INSERT INTO dbo.LIB_T_
        (CATEGORIA_LIB, SUBCATEGORIA_LIB, ISBN_LIB, NOMBRE_LIB, AUTOR_LIB, EDITORIAL_LIB, IMG_LIB, STOCK_LIB, ACTIVO_LIB)
        VALUES (@CATEGORIA_LIB, @SUBCATEGORIA_LIB, @ISBN_LIB, @NOMBRE_LIB, @AUTOR_LIB, @EDITORIAL_LIB, @IMG_LIB, @STOCK_LIB, @ACTIVO_LIB)
      `);

    res.redirect("/products");
  } catch (error) {
    console.error("Error al registrar libro:", error.message, error.stack);
    res
      .status(500)
      .json({ message: "Ocurrió un error al registrar el libro." });
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
    SUBCATEGORIA_LCAT_T.NOMBRE_SBC AS SUBCATEGORIA
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

  console.log("Datos recibidos:", req.body); 

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("ID_LIB", sql.Int, id)
      .input("NOMBRE_LIB", sql.NVarChar(300), NOMBRE_LIB)
      .input("AUTOR_LIB", sql.NVarChar(300), AUTOR_LIB)
      .input("EDITORIAL_LIB", sql.NVarChar(300), EDITORIAL_LIB)
      .input("ISBN_LIB", sql.NVarChar(300), ISBN_LIB)
      .input("STOCK_LIB", sql.Int, STOCK_LIB)
      .input("CATEGORIA_LIB", sql.Int, CATEGORIA_LIB)
      .input("SUBCATEGORIA_LIB", sql.Int, SUBCATEGORIA_LIB)
      .input("ACTIVO_LIB", sql.Bit, ACTIVO_LIB) 
      .query(`
        UPDATE LIB_T_
        SET 
          NOMBRE_LIB = @NOMBRE_LIB,
          AUTOR_LIB = @AUTOR_LIB,
          EDITORIAL_LIB = @EDITORIAL_LIB,
          ISBN_LIB = @ISBN_LIB,
          STOCK_LIB = @STOCK_LIB,
          CATEGORIA_LIB = @CATEGORIA_LIB,
          SUBCATEGORIA_LIB = @SUBCATEGORIA_LIB,
          ACTIVO_LIB = @ACTIVO_LIB
        WHERE ID_LIB = @ID_LIB
      `);

    res.json({ message: "Producto actualizado exitosamente." });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto." });
  }
};
