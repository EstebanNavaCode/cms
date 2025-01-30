import { getConnection } from "../../sis/database/conection.js";
import sql from "mssql";

export const registerCategory = async (req, res) => {
  try {
      const { NOMBRE_CAT, DESCRIPCION_CAT, subcategorias } = req.body;

      if (!NOMBRE_CAT || !DESCRIPCION_CAT) {
          return res.status(400).json({ message: "Nombre y descripción son obligatorios" });
      }

      const parsedSubcategories = Array.isArray(subcategorias)
          ? subcategorias.filter(etq => etq.NOMBRE_ETQ && typeof etq.NOMBRE_ETQ === "string" && etq.NOMBRE_ETQ.trim() !== "")
          : [];

      const pool = await getConnection();

      const result = await pool
          .request()
          .input("NOMBRE_CAT", sql.NVarChar(300), NOMBRE_CAT)
          .input("DESCRIPCION_CAT", sql.NVarChar(300), DESCRIPCION_CAT)
          .input("FECHA_ALTA_CAT", sql.Date, new Date())
          .input("ACTIVO_CAT", sql.Bit, true).query(`
              INSERT INTO CATEGORIA_NOT_T (NOMBRE_CAT, DESCRIPCION_CAT, FECHA_ALTA_CAT, ACTIVO_CAT)
              OUTPUT INSERTED.ID_CAT
              VALUES (@NOMBRE_CAT, @DESCRIPCION_CAT, @FECHA_ALTA_CAT, @ACTIVO_CAT)
          `);

      const categoryId = result.recordset[0].ID_CAT;

      for (const subcategory of parsedSubcategories) {
          await pool
              .request()
              .input("ID_CAT", sql.Int, categoryId)
              .input("NOMBRE_ETQ", sql.NVarChar(300), subcategory.NOMBRE_ETQ)
              .input("FECHA_ALTA_ETQ", sql.Date, new Date())
              .input("ACTIVO_ETQ", sql.Bit, true).query(`
                  INSERT INTO ETIQUETA_NOT_T (ID_CAT, NOMBRE_ETQ, FECHA_ALTA_ETQ, ACTIVO_ETQ)
                  VALUES (@ID_CAT, @NOMBRE_ETQ, @FECHA_ALTA_ETQ, @ACTIVO_ETQ)
              `);
      }

      res.status(201).json({ message: "Categoría y subcategorías registradas con éxito." });
  } catch (error) {
      console.error("❌ Error al registrar categoría y subcategorías:", error);
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
          etiquetas: row.ID_ETQ
            ? [{ ID_ETQ: row.ID_ETQ, NOMBRE_ETQ: row.NOMBRE_ETQ }]
            : [],
        });
      } else if (row.ID_ETQ) {
        acc[categoryIndex].etiquetas.push({
          ID_ETQ: row.ID_ETQ,
          NOMBRE_ETQ: row.NOMBRE_ETQ,
        });
      }

      return acc;
    }, []);

    res.render("categories/categories", { categories });
  } catch (error) {
    console.error("Error al obtener categorías y etiquetas:", error);
    res
      .status(500)
      .json({ message: "Error al obtener categorías y etiquetas." });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    const categoryResult = await pool.request().input("ID_CAT", sql.Int, id)
      .query(`
          SELECT ID_CAT, NOMBRE_CAT, DESCRIPCION_CAT, FECHA_ALTA_CAT, ACTIVO_CAT
          FROM CATEGORIA_NOT_T
          WHERE ID_CAT = @ID_CAT
        `);

    if (categoryResult.recordset.length === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    const category = categoryResult.recordset[0];

    const tagsResult = await pool.request().input("ID_CAT", sql.Int, id).query(`
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

export const editCategoryAndTags = async (req, res) => {
  try {
    const { id } = req.params;
    const { NOMBRE_CAT, DESCRIPCION_CAT, ACTIVO_CAT, etiquetas } = req.body;

    // console.log("🔵 Recibida solicitud de edición para ID_CAT:", id);
    // console.log("📌 Datos recibidos:", {
    //   NOMBRE_CAT,
    //   DESCRIPCION_CAT,
    //   ACTIVO_CAT,
    //   etiquetas,
    // });

    if (!NOMBRE_CAT || !DESCRIPCION_CAT) {
      console.warn("⚠️ Nombre y descripción son obligatorios.");
      return res
        .status(400)
        .json({ message: "Nombre y descripción son obligatorios" });
    }

    const pool = await getConnection();

    // Actualizar la categoría
    // console.log("✏️ Actualizando categoría...");
    // ✅ Actualizar el estado de la categoría en la base de datos
    await pool
      .request()
      .input("ID_CAT", sql.Int, id)
      .input("NOMBRE_CAT", sql.NVarChar(300), NOMBRE_CAT)
      .input("DESCRIPCION_CAT", sql.NVarChar(300), DESCRIPCION_CAT)
      .input("ACTIVO_CAT", sql.Bit, ACTIVO_CAT) 
      .query(`
    UPDATE CATEGORIA_NOT_T 
    SET NOMBRE_CAT = @NOMBRE_CAT, 
        DESCRIPCION_CAT = @DESCRIPCION_CAT, 
        ACTIVO_CAT = @ACTIVO_CAT
    WHERE ID_CAT = @ID_CAT
`);

    // console.log("✅ Categoría actualizada.");

    // Obtener etiquetas actuales
    const etiquetasActuales = await pool
      .request()
      .input("ID_CAT", sql.Int, id)
      .query(
        "SELECT ID_ETQ, NOMBRE_ETQ FROM ETIQUETA_NOT_T WHERE ID_CAT = @ID_CAT"
      );

    // console.log("📋 Etiquetas actuales en la BD:", etiquetasActuales.recordset);

    const etiquetasDB = etiquetasActuales.recordset;

    // Identificar etiquetas nuevas, eliminadas y modificadas
    const etiquetasNuevas = etiquetas.filter((etq) => etq.ID_ETQ === null);
    const etiquetasEliminadas = etiquetasDB.filter(
      (e) => !etiquetas.some((etq) => etq.ID_ETQ === e.ID_ETQ)
    );
    const etiquetasEditadas = etiquetas.filter(
      (etq) =>
        etq.ID_ETQ &&
        etiquetasDB.some(
          (e) => e.ID_ETQ === etq.ID_ETQ && e.NOMBRE_ETQ !== etq.NOMBRE_ETQ
        )
    );

    // console.log("➕ Etiquetas nuevas a agregar:", etiquetasNuevas);
    // console.log("❌ Etiquetas a eliminar:", etiquetasEliminadas);
    // console.log("✏️ Etiquetas a editar:", etiquetasEditadas);

    // **Eliminar etiquetas**
    for (const etq of etiquetasEliminadas) {
      // console.log(`🛑 Eliminando etiqueta ID_ETQ: ${etq.ID_ETQ}`);
      await pool
        .request()
        .input("ID_ETQ", sql.Int, etq.ID_ETQ)
        .query("DELETE FROM ETIQUETA_NOT_T WHERE ID_ETQ = @ID_ETQ");
    }

    // **Editar etiquetas**
    for (const etq of etiquetasEditadas) {
      // console.log(`✏️ Editando etiqueta ID_ETQ: ${etq.ID_ETQ}, Nuevo Nombre: ${etq.NOMBRE_ETQ}`);
      await pool
        .request()
        .input("ID_ETQ", sql.Int, etq.ID_ETQ)
        .input("NOMBRE_ETQ", sql.NVarChar(300), etq.NOMBRE_ETQ)
        .query(
          "UPDATE ETIQUETA_NOT_T SET NOMBRE_ETQ = @NOMBRE_ETQ WHERE ID_ETQ = @ID_ETQ"
        );
    }

    // **Agregar nuevas etiquetas**
    for (const etq of etiquetasNuevas) {
      // console.log(`🟢 Agregando etiqueta: ${etq.NOMBRE_ETQ}`);
      await pool
        .request()
        .input("ID_CAT", sql.Int, id)
        .input("NOMBRE_ETQ", sql.NVarChar(300), etq.NOMBRE_ETQ)
        .input("FECHA_ALTA_ETQ", sql.Date, new Date())
        .input("ACTIVO_ETQ", sql.Bit, 1).query(`
                  INSERT INTO ETIQUETA_NOT_T (ID_CAT, NOMBRE_ETQ, FECHA_ALTA_ETQ, ACTIVO_ETQ) 
                  VALUES (@ID_CAT, @NOMBRE_ETQ, @FECHA_ALTA_ETQ, @ACTIVO_ETQ)
              `);
    }

    // console.log("✅ Edición de etiquetas completada.");
    res.json({ message: "Categoría y etiquetas actualizadas con éxito." });
  } catch (error) {
    console.error("❌ Error al actualizar la categoría y etiquetas:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar la categoría y etiquetas." });
  }
};
