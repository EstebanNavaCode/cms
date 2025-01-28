import { getConnection } from "../../sis/database/conection.js";
import sql from "mssql";

export const registerCategory = async (req, res) => {
    try {
      const { NOMBRE_CAT, DESCRIPCION_CAT, subcategorias } = req.body;
  
      //console.log("Datos recibidos:", { NOMBRE_CAT, DESCRIPCION_CAT, subcategorias });
  
      const parsedSubcategories = Array.isArray(subcategorias) ? subcategorias : [];
  
      if (!NOMBRE_CAT || !DESCRIPCION_CAT) {
        return res.status(400).json({ message: "Nombre y descripción son obligatorios" });
      }
  
      const pool = await getConnection();
  
      const result = await pool
        .request()
        .input("NOMBRE_CAT", sql.NVarChar(300), NOMBRE_CAT)
        .input("DESCRIPCION_CAT", sql.NVarChar(300), DESCRIPCION_CAT)
        .input("FECHA_ALTA_CAT", sql.Date, new Date())
        .input("ACTIVO_CAT", sql.Bit, true)
        .query(`
          INSERT INTO CATEGORIA_NOT_T (NOMBRE_CAT, DESCRIPCION_CAT, FECHA_ALTA_CAT, ACTIVO_CAT)
          OUTPUT INSERTED.ID_CAT
          VALUES (@NOMBRE_CAT, @DESCRIPCION_CAT, @FECHA_ALTA_CAT, @ACTIVO_CAT)
        `);
  
      const categoryId = result.recordset[0].ID_CAT;
  
      for (const subcategoryName of parsedSubcategories) {
        await pool
        .request()
        .input("ID_CAT", sql.Int, categoryId)
        .input("NOMBRE_ETQ", sql.NVarChar(300), subcategoryName) 
        .input("FECHA_ALTA_ETQ", sql.Date, new Date())
        .input("ACTIVO_ETQ", sql.Bit, true) 
        .query(`
          INSERT INTO ETIQUETA_NOT_T (ID_CAT, NOMBRE_ETQ, FECHA_ALTA_ETQ, ACTIVO_ETQ)
          VALUES (@ID_CAT, @NOMBRE_ETQ, @FECHA_ALTA_ETQ, @ACTIVO_ETQ)
        `);
      }
  
      res.status(201).json({ message: "Categoría y subcategorías registradas con éxito." });
    } catch (error) {
      console.error("Error al registrar categoría y subcategorías:", error);
      res.status(500).json({ message: "Error al registrar categoría y subcategorías." });
    }
  };

  export const getCategoriesAndTags = async (req, res) => {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT 
          c.ID_CAT, 
          c.NOMBRE_CAT, 
          c.DESCRIPCION_CAT, 
          c.FECHA_ALTA_CAT, 
          c.ACTIVO_CAT,
          e.ID_ETQ,
          e.NOMBRE_ETQ
        FROM CATEGORIA_NOT_T c
        LEFT JOIN ETIQUETA_NOT_T e ON c.ID_CAT = e.ID_CAT
        WHERE c.ACTIVO_CAT = 1
        ORDER BY c.ID_CAT, e.ID_ETQ
      `);
  
      const categories = result.recordset.reduce((acc, row) => {
        const categoryIndex = acc.findIndex((cat) => cat.ID_CAT === row.ID_CAT);
  
        if (categoryIndex === -1) {
          acc.push({
            ID_CAT: row.ID_CAT,
            NOMBRE_CAT: row.NOMBRE_CAT,
            DESCRIPCION_CAT: row.DESCRIPCION_CAT,
            FECHA_ALTA_CAT: row.FECHA_ALTA_CAT,
            ACTIVO_CAT: row.ACTIVO_CAT,
            etiquetas: row.ID_ETQ ? [{ ID_ETQ: row.ID_ETQ, NOMBRE_ETQ: row.NOMBRE_ETQ }] : [],
          });
        } else if (row.ID_ETQ) {
          acc[categoryIndex].etiquetas.push({ ID_ETQ: row.ID_ETQ, NOMBRE_ETQ: row.NOMBRE_ETQ });
        }
  
        return acc;
      }, []);
  
      res.render("categories/categories", { categories });
    } catch (error) {
      console.error("Error al obtener categorías y etiquetas:", error);
      res.status(500).json({ message: "Error al obtener categorías y etiquetas." });
    }
  };
  
  export const getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const pool = await getConnection();
  
      const categoryResult = await pool
        .request()
        .input("ID_CAT", sql.Int, id)
        .query(`
          SELECT ID_CAT, NOMBRE_CAT, DESCRIPCION_CAT, FECHA_ALTA_CAT, ACTIVO_CAT
          FROM CATEGORIA_NOT_T
          WHERE ID_CAT = @ID_CAT
        `);
  
      if (categoryResult.recordset.length === 0) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
  
      const category = categoryResult.recordset[0];
  
      const tagsResult = await pool
        .request()
        .input("ID_CAT", sql.Int, id)
        .query(`
          SELECT ID_ETQ, NOMBRE_ETQ 
          FROM ETIQUETA_NOT_T 
          WHERE ID_CAT = @ID_CAT
        `);
  
      category.etiquetas = tagsResult.recordset;
  
      res.json(category);
    } catch (error) {
      console.error("Error al obtener la categoría:", error);
      res.status(500).json({ message: "Error al obtener la categoría." });
    }
  };
  