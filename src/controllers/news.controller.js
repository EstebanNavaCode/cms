import { getConnection } from "../../sis/database/conection.js";
import sql from "mssql";

export const registerNews = async (req, res) => {
  try {
      const {
          TITULO_NOT,
          TEXTO_NOT,
          FECHA_PUBLICAR_NOT,
          CATEGORIA_NOT,
          ETIQUETA_NOT,
          IMG_NOT,
      } = req.body;

      if (!TITULO_NOT || !TEXTO_NOT || !CATEGORIA_NOT || !FECHA_PUBLICAR_NOT || !ETIQUETA_NOT) {
          return res.status(400).json({ message: "Todos los campos obligatorios deben ser proporcionados." });
      }
      
    const pool = await getConnection();

    await pool
    .request()
    .input("CATEGORIA_NOt", sql.Int, CATEGORIA_NOT)
    .input("ETIQUETA_NOT", sql.Int, ETIQUETA_NOT)
    .input("TITULO_NOT", sql.NVarChar(300), TITULO_NOT)
    .input("TEXTO_NOT", sql.NVarChar(300), TEXTO_NOT)
    .input("FECHA_PUBLICAR_NOT", sql.Date, FECHA_PUBLICAR_NOT)
    .input("IMG_NOT", sql.NVarChar(300), IMG_NOT)
    .input("FECHA_ALTA_NOT", sql.Date, new Date())
    .input("ACTIVO_NOT", sql.Bit, 1)
    .query(`
      INSERT INTO dbo.NOT_T
      (CATEGORIA_NOT, ETIQUETA_NOT, TITULO_NOT, TEXTO_NOT, FECHA_PUBLICAR_NOT, ACTIVO_NOT, IMG_NOT, FECHA_ALTA_NOT)
      VALUES (@CATEGORIA_NOT, @ETIQUETA_NOT, @TITULO_NOT, @TEXTO_NOT, @FECHA_PUBLICAR_NOT, @ACTIVO_NOT, @IMG_NOT, @FECHA_ALTA_NOT)
    `);
  

      res.status(200).json({ message: "Noticia registrada exitosamente." });
    } catch (error) {
        console.error("Error al registrar noticia:", error);
        res.status(500).json({ message: "Ocurrió un error al registrar la noticia." });
    }
}

export const getCategoriesNEWS = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(
        `SELECT ID_CAT, 
        NOMBRE_CAT FROM 
        CATEGORIA_NOT_T 
        WHERE ACTIVO_CAT = 1`
      );

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).send("Error al obtener categorías.");
  }
};

export const getSubcategoriesNEWS = async (req, res) => {
    const { categoryId } = req.params;
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("categoryId", sql.Int, categoryId)
        .query(`
          SELECT ID_ETQ, NOMBRE_ETQ
          FROM ETIQUETA_NOT_T
          WHERE ACTIVO_ETQ = 1 AND ID_CAT = @categoryId
        `);
  
      console.log("Subcategorías enviadas:", result.recordset);
      res.json(result.recordset);
    } catch (error) {
      console.error("Error al obtener subcategorías:", error.message);
      res.status(500).json({ message: "Error al obtener subcategorías." });
    }
  };
  
  