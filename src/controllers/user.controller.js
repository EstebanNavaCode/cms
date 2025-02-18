import { getConnection } from "../../sis/database/conection.js";
import fs from "fs";
import path from "path";
import sql from "mssql";

export const renderLogin = (req, res) => {
  res.render("home/home");
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password)
      .query(
        "SELECT * FROM USR_T WHERE CORREO_USR = @email AND CONTRASENA_USR = @password"
      );

    if (result.recordset.length > 0) {
      res.json({ success: true });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  } catch (err) {
    res.status(500).render("home/home", {
      error: "Error al ingresar al sistema. Inténtalo de nuevo.",
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { TIPO_USR, NOMBRE_USR, APELLIDO_USR, CORREO_USR, CONTRASENA_USR } = req.body;
    const imgFile = req.files?.IMG_USR;
 
    if (!TIPO_USR || !NOMBRE_USR || !APELLIDO_USR || !CORREO_USR || !CONTRASENA_USR) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }
 
    const pool = await getConnection();
 
    // 🔍 Verificar si el correo ya existe
    const existingUser = await pool
      .request()
      .input("CORREO_USR", sql.NVarChar(300), CORREO_USR)
      .query("SELECT 1 FROM USR_T WHERE CORREO_USR = @CORREO_USR");
 
    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }
 
    let imgFilename = null;
    if (imgFile) {
      const uploadDir = path.join(process.cwd(), "uploads/pics");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
 
      imgFilename = CORREO_USR.replace(/[@.]/g, "_") + path.extname(imgFile.name);
      const uploadPath = path.join(uploadDir, imgFilename);
      await imgFile.mv(uploadPath);
    }
 
    await pool
      .request()
      .input("TIPO_USR", sql.Int, TIPO_USR)
      .input("NOMBRE_USR", sql.NVarChar(300), NOMBRE_USR)
      .input("APELLIDO_USR", sql.NVarChar(300), APELLIDO_USR)
      .input("CORREO_USR", sql.NVarChar(300), CORREO_USR)
      .input("CONTRASENA_USR", sql.NVarChar(300), CONTRASENA_USR)
      .input("FECHA_ALTA_USR", sql.Date, new Date())
      .input("ACTIVO_USR", sql.Bit, true)
      .input("IMG_USR", sql.NVarChar(300), imgFilename ? `/uploads/pics/${imgFilename}` : null)
      .query(`
        INSERT INTO dbo.USR_T (TIPO_USR, NOMBRE_USR, APELLIDO_USR, CORREO_USR, 
        CONTRASENA_USR, FECHA_ALTA_USR, ACTIVO_USR, IMG_USR)
        VALUES (@TIPO_USR, @NOMBRE_USR, @APELLIDO_USR, @CORREO_USR, 
        @CONTRASENA_USR, @FECHA_ALTA_USR, @ACTIVO_USR, @IMG_USR)
      `);
 
    res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Ocurrió un error al registrar el usuario." });
  }
};

export const getUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        ID_USR, 
        NOMBRE_USR, 
        APELLIDO_USR, 
        CORREO_USR, 
        CASE 
          WHEN TIPO_USR = 1 THEN 'ADMIN'
          WHEN TIPO_USR = 2 THEN 'GERENTE'
          WHEN TIPO_USR = 3 THEN 'COLABORADOR'
          ELSE 'DESCONOCIDO'
        END AS TIPO_USR,
        CONVERT(VARCHAR, FECHA_ALTA_USR, 23) AS FECHA_ALTA_USR,
        ACTIVO_USR,
        IMG_USR  -- Asegúrate de traer el campo IMG_USR
      FROM USR_T;
    `);

    res.render("users/users", { users: result.recordset });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener la lista de usuarios." });
  }
};

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { TIPO_USR, NOMBRE_USR, APELLIDO_USR, CORREO_USR, ACTIVO_USR } = req.body;
    const imgFile = req.files?.IMG_USR;

    if (!id || !TIPO_USR || !NOMBRE_USR || !APELLIDO_USR || !CORREO_USR) {
      return res.status(400).json({
        message: "Todos los campos obligatorios deben ser proporcionados.",
      });
    }

    const pool = await getConnection();

    // 🔍 Obtener la imagen actual en la base de datos
    const result = await pool
      .request()
      .input("ID_USR", sql.Int, id)
      .query("SELECT IMG_USR FROM USR_T WHERE ID_USR = @ID_USR");

    let imgFilename = result.recordset[0]?.IMG_USR || null;

    // 📷 Si se sube una nueva imagen, eliminar la anterior y guardar la nueva
    if (imgFile) {
      const uploadDir = path.join(process.cwd(), "uploads/pics");

      if (imgFilename) {
        const oldImagePath = path.join(uploadDir, path.basename(imgFilename));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      imgFilename = CORREO_USR.replace(/[@.]/g, "_") + path.extname(imgFile.name);
      const uploadPath = path.join(uploadDir, imgFilename);
      
      await imgFile.mv(uploadPath);

      imgFilename = `/uploads/pics/${imgFilename}`;
    }

    // 🛠️ Asegurar que `ACTIVO_USR` se convierte correctamente a booleano
    const isActive = ACTIVO_USR === "1" || ACTIVO_USR === 1 || ACTIVO_USR === true;
    
    /*console.log("🟢 Datos recibidos en backend:", {
      ID_USR: id,
      TIPO_USR,
      NOMBRE_USR,
      APELLIDO_USR,
      CORREO_USR,
      ACTIVO_USR,
      isActive,
      IMG_USR: imgFilename
    });*/

    // 🔄 Actualizar usuario en la BD
    await pool
      .request()
      .input("ID_USR", sql.Int, parseInt(id, 10))
      .input("TIPO_USR", sql.Int, TIPO_USR)
      .input("NOMBRE_USR", sql.NVarChar(300), NOMBRE_USR)
      .input("APELLIDO_USR", sql.NVarChar(300), APELLIDO_USR)
      .input("CORREO_USR", sql.NVarChar(300), CORREO_USR)
      .input("ACTIVO_USR", sql.Bit, isActive) // ✅ Se usa `isActive` en lugar de `ACTIVO_USR`
      .input("IMG_USR", sql.NVarChar(300), imgFilename)
      .query(`
        UPDATE dbo.USR_T 
        SET 
          TIPO_USR = @TIPO_USR, 
          NOMBRE_USR = @NOMBRE_USR, 
          APELLIDO_USR = @APELLIDO_USR, 
          CORREO_USR = @CORREO_USR, 
          ACTIVO_USR = @ACTIVO_USR,
          IMG_USR = @IMG_USR
        WHERE ID_USR = @ID_USR
      `);

    res.json({ message: "Usuario actualizado correctamente." });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ message: "Ocurrió un error al actualizar el usuario." });
  }
};
