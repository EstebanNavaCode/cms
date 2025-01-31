import { getConnection } from "../../sis/database/conection.js";
import sql from "mssql";

export const registerGenero = async (req, res) => {
  try {
    const { NOMBRE_LCAT, DESCRIPCION_LCAT, subgeneros } = req.body;

    if (!NOMBRE_LCAT || !DESCRIPCION_LCAT) {
      return res
        .status(400)
        .json({ message: "Nombre y descripción son obligatorios" });
    }

    let subgenerosArray = [];
    try {
      subgenerosArray =
        typeof subgeneros === "string" ? JSON.parse(subgeneros) : subgeneros;
    } catch (error) {
      console.error("❌ Error al parsear subgéneros:", error);
      return res
        .status(400)
        .json({ message: "Formato de subgéneros inválido." });
    }

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("NOMBRE_LCAT", sql.NVarChar(300), NOMBRE_LCAT)
      .input("DESCRIPCION_LCAT", sql.NVarChar(300), DESCRIPCION_LCAT)
      .input("FECHA_ALTA_LCAT", sql.Date, new Date())
      .input("ACTIVO_LCAT", sql.Bit, true).query(`
                INSERT INTO CATEGORIA_LIB_T (NOMBRE_LCAT, DESCRIPCION_LCAT, FECHA_ALTA_LCAT, ACTIVO_LCAT)
                OUTPUT INSERTED.ID_LCAT
                VALUES (@NOMBRE_LCAT, @DESCRIPCION_LCAT, @FECHA_ALTA_LCAT, @ACTIVO_LCAT)
            `);

    const generoId = result.recordset[0].ID_LCAT;

    for (const subgenero of subgenerosArray) {
      await pool
        .request()
        .input("ID_LCAT", sql.Int, generoId)
        .input("NOMBRE_SBC", sql.NVarChar(300), subgenero)
        .input("FECHA_ALTA_SBC", sql.Date, new Date())
        .input("ACTIVO_SBC", sql.Bit, true).query(`
                    INSERT INTO SUBCATEGORIA_LCAT_T (ID_LCAT, NOMBRE_SBC, FECHA_ALTA_SBC, ACTIVO_SBC)
                    VALUES (@ID_LCAT, @NOMBRE_SBC, @FECHA_ALTA_SBC, @ACTIVO_SBC)
                `);
    }

    res
      .status(201)
      .json({
        message: "Género y subgéneros registrados con éxito.",
        redirect: "/generos",
      });
  } catch (error) {
    console.error("❌ Error al registrar género y subgéneros:", error);
    res
      .status(500)
      .json({ message: "Error al registrar género y subgéneros." });
  }
};

export const getGenerosAndSubgeneros = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
            SELECT 
                g.ID_LCAT, 
                g.NOMBRE_LCAT, 
                g.DESCRIPCION_LCAT, 
                g.FECHA_ALTA_LCAT, 
                g.ACTIVO_LCAT,
                s.ID_SBC,
                s.NOMBRE_SBC
            FROM CATEGORIA_LIB_T g
            LEFT JOIN SUBCATEGORIA_LCAT_T s ON g.ID_LCAT = s.ID_LCAT
            ORDER BY g.ID_LCAT, s.ID_SBC
        `);

    const generos = result.recordset.reduce((acc, row) => {
      const generoIndex = acc.findIndex((g) => g.ID_LCAT === row.ID_LCAT);

      if (generoIndex === -1) {
        acc.push({
          ID_LCAT: row.ID_LCAT,
          NOMBRE_LCAT: row.NOMBRE_LCAT,
          DESCRIPCION_LCAT: row.DESCRIPCION_LCAT,
          FECHA_ALTA_LCAT: row.FECHA_ALTA_LCAT,
          ACTIVO_LCAT: row.ACTIVO_LCAT,
          subgeneros: row.ID_SBC
            ? [{ ID_SBC: row.ID_SBC, NOMBRE_SBC: row.NOMBRE_SBC }]
            : [],
        });
      } else if (row.ID_SBC) {
        acc[generoIndex].subgeneros.push({
          ID_SBC: row.ID_SBC,
          NOMBRE_SBC: row.NOMBRE_SBC,
        });
      }

      return acc;
    }, []);

    res.render("generos/generos", { generos });
  } catch (error) {
    console.error("Error al obtener géneros y subgéneros:", error);
    res.status(500).json({ message: "Error al obtener géneros y subgéneros." });
  }
};

export const getGeneroById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    const generoResult = await pool.request().input("ID_LCAT", sql.Int, id)
      .query(`
            SELECT ID_LCAT, NOMBRE_LCAT, DESCRIPCION_LCAT, FECHA_ALTA_LCAT, ACTIVO_LCAT
            FROM CATEGORIA_LIB_T
            WHERE ID_LCAT = @ID_LCAT
        `);

    if (generoResult.recordset.length === 0) {
      return res.status(404).json({ message: "Género no encontrado" });
    }

    const genero = generoResult.recordset[0];

    const subgenerosResult = await pool.request().input("ID_LCAT", sql.Int, id)
      .query(`
            SELECT ID_SBC, NOMBRE_SBC 
            FROM SUBCATEGORIA_LCAT_T 
            WHERE ID_LCAT = @ID_LCAT
        `);

    genero.subgeneros = subgenerosResult.recordset;

    res.json(genero);
  } catch (error) {
    console.error("❌ Error al obtener el género:", error);
    res.status(500).json({ message: "Error al obtener el género." });
  }
};

export const editGenero = async (req, res) => {
  try {
    const { id } = req.params;
    const { NOMBRE_LCAT, DESCRIPCION_LCAT, ACTIVO_LCAT, subgeneros } = req.body;

    if (!NOMBRE_LCAT || !DESCRIPCION_LCAT) {
      return res
        .status(400)
        .json({ message: "Nombre y descripción son obligatorios" });
    }

    let subgenerosArray = [];
    if (subgeneros) {
      try {
        subgenerosArray = JSON.parse(subgeneros);
      } catch (error) {
        console.error("❌ Error al parsear subgéneros:", error);
        return res
          .status(400)
          .json({ message: "Formato de subgéneros inválido." });
      }
    }

    const pool = await getConnection();

    const checkGenero = await pool
      .request()
      .input("ID_LCAT", sql.Int, id)
      .query("SELECT ID_LCAT FROM CATEGORIA_LIB_T WHERE ID_LCAT = @ID_LCAT");

    if (checkGenero.recordset.length === 0) {
      return res.status(404).json({ message: "Género no encontrado" });
    }
    await pool
      .request()
      .input("ID_LCAT", sql.Int, id)
      .input("NOMBRE_LCAT", sql.NVarChar(300), NOMBRE_LCAT)
      .input("DESCRIPCION_LCAT", sql.NVarChar(300), DESCRIPCION_LCAT)
      .input("ACTIVO_LCAT", sql.Bit, ACTIVO_LCAT ? 1 : 0).query(`
                UPDATE CATEGORIA_LIB_T 
                SET NOMBRE_LCAT = @NOMBRE_LCAT, DESCRIPCION_LCAT = @DESCRIPCION_LCAT, ACTIVO_LCAT = @ACTIVO_LCAT
                WHERE ID_LCAT = @ID_LCAT
            `);

    await pool
      .request()
      .input("ID_LCAT", sql.Int, id)
      .query(`DELETE FROM SUBCATEGORIA_LCAT_T WHERE ID_LCAT = @ID_LCAT`);

    for (const subgenero of subgenerosArray) {
      await pool
        .request()
        .input("ID_LCAT", sql.Int, id)
        .input("NOMBRE_SBC", sql.NVarChar(300), subgenero)
        .query(
          `INSERT INTO SUBCATEGORIA_LCAT_T (ID_LCAT, NOMBRE_SBC) VALUES (@ID_LCAT, @NOMBRE_SBC)`
        );
    }

    res.json({ message: "Género actualizado con éxito." });
  } catch (error) {
    console.error("❌ Error al actualizar género:", error);
    res.status(500).json({ message: "Error al actualizar género." });
  }
};
