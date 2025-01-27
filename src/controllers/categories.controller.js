import { getConnection } from "../../sis/database/conection.js";
import sql from "mssql";

export const registerCategory = async (req, res) => {
    try {
      const { NOMBRE_CAT, DESCRIPCION_CAT, subcategorias } = req.body;
  
      console.log("Datos recibidos:", { NOMBRE_CAT, DESCRIPCION_CAT, subcategorias });
  
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
  
      console.log("ID de categoría registrada:", categoryId);
  
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
      
      
  
        console.log(`Subcategoría "${subcategoryName}" registrada con éxito.`);
      }
  
      res.status(201).json({ message: "Categoría y subcategorías registradas con éxito." });
    } catch (error) {
      console.error("Error al registrar categoría y subcategorías:", error);
      res.status(500).json({ message: "Error al registrar categoría y subcategorías." });
    }
  };
  