import { getConnection } from "../../sis/database/conection.js";
import sql from "mssql";
import fs from "fs";
import path from "path";

export const registerNews = async (req, res) => {
  try {
    const {
      TITULO_NOT,
      TEXTO_NOT,
      FECHA_PUBLICAR_NOT,
      CATEGORIA_NOT,
      ETIQUETA_NOT,
    } = req.body;

    const imgFile = req.files?.IMG_NOT;
    let imgFilename = null;

    if (imgFile) {
      const uploadDir = path.join(process.cwd(), "uploads/news");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      imgFilename = TITULO_NOT.replace(/\s+/g, "_") + path.extname(imgFile.name);
      const uploadPath = path.join(uploadDir, imgFilename);
      await imgFile.mv(uploadPath);
    }

    // 🔹 Asignar un valor por defecto para `FECHA_ALTA_NOT`
    const FECHA_ALTA_NOT = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // 🔹 Si `ACTIVO_NOT` no se envía, asignamos `1` (Activo) por defecto
    const ACTIVO_NOT = req.body.ACTIVO_NOT !== undefined ? req.body.ACTIVO_NOT : 1;

    const pool = await getConnection();
    await pool
      .request()
      .input("CATEGORIA_NOT", sql.Int, CATEGORIA_NOT)
      .input("ETIQUETA_NOT", sql.Int, ETIQUETA_NOT)
      .input("TITULO_NOT", sql.NVarChar(300), TITULO_NOT)
      .input("TEXTO_NOT", sql.NVarChar(sql.MAX), TEXTO_NOT)
      .input("FECHA_PUBLICAR_NOT", sql.Date, FECHA_PUBLICAR_NOT)
      .input("IMG_NOT", sql.NVarChar(300), imgFilename ? `/uploads/news/${imgFilename}` : null)
      .input("FECHA_ALTA_NOT", sql.Date, FECHA_ALTA_NOT) // 🔹 Se envía `FECHA_ALTA_NOT`
      .input("ACTIVO_NOT", sql.Bit, ACTIVO_NOT) // 🔹 Se agrega `ACTIVO_NOT` con un valor por defecto
      .query(`
        INSERT INTO dbo.NOT_T (CATEGORIA_NOT, ETIQUETA_NOT, TITULO_NOT, TEXTO_NOT, FECHA_PUBLICAR_NOT, IMG_NOT, FECHA_ALTA_NOT, ACTIVO_NOT)
        VALUES (@CATEGORIA_NOT, @ETIQUETA_NOT, @TITULO_NOT, @TEXTO_NOT, @FECHA_PUBLICAR_NOT, @IMG_NOT, @FECHA_ALTA_NOT, @ACTIVO_NOT)
      `);

    res.status(200).json({ message: "Noticia registrada exitosamente." });
  } catch (error) {
    console.error("Error al registrar noticia:", error);
    res.status(500).json({ message: "Error al registrar la noticia." });
  }
};


export const getCategoriesNEWS = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(
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
  if (isNaN(categoryId)) {
    return res
      .status(400)
      .json({ message: "El parámetro categoryId debe ser un número válido." });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request().input("categoryId", sql.Int, categoryId)
      .query(`
        SELECT ID_ETQ, NOMBRE_ETQ
        FROM ETIQUETA_NOT_T
        WHERE ACTIVO_ETQ = 1 AND ID_CAT = @categoryId
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener subcategorías:", error.message);
    res.status(500).json({ message: "Error al obtener subcategorías." });
  }
};

export const getNews = async (req, res) => {
  try {
      const pool = await getConnection();
      const result = await pool.request().query(`
          SELECT 
              N.ID_NOT,
              N.TITULO_NOT,
              N.TEXTO_NOT,
              N.FECHA_PUBLICAR_NOT,
              N.CATEGORIA_NOT AS ID_CATEGORIA,
              C.NOMBRE_CAT AS CATEGORIA,
              N.ETIQUETA_NOT AS ID_ETIQUETA,
              E.NOMBRE_ETQ AS ETIQUETA,
              N.ACTIVO_NOT,
              CASE 
                  WHEN N.IMG_NOT IS NOT NULL AND N.IMG_NOT <> '' THEN N.IMG_NOT
                  ELSE '/uploads/news/default-placeholder.jpg'
              END AS IMG_NOT
          FROM NOT_T N
          LEFT JOIN CATEGORIA_NOT_T C ON N.CATEGORIA_NOT = C.ID_CAT
          LEFT JOIN ETIQUETA_NOT_T E ON N.ETIQUETA_NOT = E.ID_ETQ
      `);

      console.log("Noticias cargadas desde la BD:", result.recordset);

      res.render("news/news", { news: result.recordset });
  } catch (error) {
      console.error("Error al obtener noticias:", error);
      res.status(500).json({ message: "Error al obtener la lista de noticias." });
  }
};

export const editNews = async (req, res) => {
  const { id } = req.params;
  const {
    TITULO_NOT,
    TEXTO_NOT,
    FECHA_PUBLICAR_NOT,
    CATEGORIA_NOT,
    ETIQUETA_NOT,
  } = req.body;

  const imgFile = req.files?.IMG_NOT;
  let imgFilename = null;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("ID_NOT", sql.Int, id)
      .query("SELECT IMG_NOT FROM NOT_T WHERE ID_NOT = @ID_NOT");

    let oldImagePath = result.recordset[0]?.IMG_NOT;

    if (imgFile) {
      const uploadDir = path.join(process.cwd(), "uploads/news");

      if (oldImagePath) {
        const oldPath = path.join(uploadDir, path.basename(oldImagePath));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      imgFilename = TITULO_NOT.replace(/\s+/g, "_") + path.extname(imgFile.name);
      const uploadPath = path.join(uploadDir, imgFilename);
      await imgFile.mv(uploadPath);
    }

    await pool
      .request()
      .input("TITULO_NOT", sql.NVarChar(300), TITULO_NOT)
      .input("TEXTO_NOT", sql.NVarChar(sql.MAX), TEXTO_NOT)
      .input("FECHA_PUBLICAR_NOT", sql.Date, FECHA_PUBLICAR_NOT)
      .input("CATEGORIA_NOT", sql.Int, CATEGORIA_NOT)
      .input("ETIQUETA_NOT", sql.Int, ETIQUETA_NOT)
      .input("IMG_NOT", sql.NVarChar(300), imgFilename ? `/uploads/news/${imgFilename}` : oldImagePath)
      .input("ID_NOT", sql.Int, id)
      .query(`
        UPDATE NOT_T
        SET TITULO_NOT = @TITULO_NOT,
            TEXTO_NOT = @TEXTO_NOT,
            FECHA_PUBLICAR_NOT = @FECHA_PUBLICAR_NOT,
            CATEGORIA_NOT = @CATEGORIA_NOT,
            ETIQUETA_NOT = @ETIQUETA_NOT,
            IMG_NOT = @IMG_NOT
        WHERE ID_NOT = @ID_NOT
      `);

    res.status(200).json({ message: "Noticia actualizada exitosamente." });
  } catch (error) {
    console.error("Error al actualizar noticia:", error);
    res.status(500).json({ message: "Error al actualizar noticia." });
  }
};

