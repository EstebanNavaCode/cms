import { getConnection } from "../../sis/database/conection.js";
import fs from "fs";
import path from "path";
import sql from "mssql";

import nodemailer from "nodemailer";

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nava.esteban.0200.17@gmail.com",
    pass: "gwduarmsupathrcg",
    //gwdu arms upat hrcg
  },
});

async function sendPasswordEmail(to, password) {
  const mailOptions = {
    from: "tu-correo@gmail.com",
    to: to,
    subject: "Contraseña de acceso - CMS",
    text: `Hola,\n\nTu cuenta ha sido creada con éxito. Tu contraseña temporal es: ${password}\n\nPor favor, cámbiala después de iniciar sesión.\n\nSaludos,`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente");
  } catch (error) {
    console.error("Error enviando el correo:", error);
  }
}

export const renderLogin = (req, res) => {
  res.render("home/home");
};

function generateRandomPassword(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password)
      .query(
        "SELECT ID_USR FROM USR_T WHERE CORREO_USR = @email AND CONTRASENA_USR = @password"
      );

    if (result.recordset.length > 0) {
      const userId = result.recordset[0].ID_USR;

      const userData = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query(
          "SELECT ID_USR, NOMBRE_USR, APELLIDO_USR, CORREO_USR, IMG_USR, TIPO_USR FROM USR_T WHERE CORREO_USR = @email"
        );

      if (userData.recordset.length > 0) {
        const user = userData.recordset[0];

        res.json({
          success: true,
          user: {
            id: user.ID_USR,
            nombre: user.NOMBRE_USR,
            apellido: user.APELLIDO_USR,
            correo: user.CORREO_USR,
            imagen: user.IMG_USR,
            tipo: user.TIPO_USR,
          },
        });
      } else {
        res.status(401).json({
          success: false,
          message: "No se encontraron datos del usuario.",
        });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error al ingresar al sistema. Inténtalo de nuevo.",
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { TIPO_USR, NOMBRE_USR, APELLIDO_USR, CORREO_USR } = req.body;
    const imgFile = req.files?.IMG_USR;

    if (!TIPO_USR || !NOMBRE_USR || !APELLIDO_USR || !CORREO_USR) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    const pool = await getConnection();

    const existingUser = await pool
      .request()
      .input("CORREO_USR", sql.NVarChar(300), CORREO_USR)
      .query("SELECT 1 FROM USR_T WHERE CORREO_USR = @CORREO_USR");

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    const CONTRASENA_USR = generateRandomPassword();

    let imgFilename = null;
    if (imgFile) {
      const uploadDir = path.join(process.cwd(), "uploads/pics");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      imgFilename =
        CORREO_USR.replace(/[@.]/g, "_") + path.extname(imgFile.name);
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
      .input(
        "IMG_USR",
        sql.NVarChar(300),
        imgFilename ? `/uploads/pics/${imgFilename}` : null
      ).query(`
        INSERT INTO dbo.USR_T (TIPO_USR, NOMBRE_USR, APELLIDO_USR, CORREO_USR, 
        CONTRASENA_USR, FECHA_ALTA_USR, ACTIVO_USR, IMG_USR)
        VALUES (@TIPO_USR, @NOMBRE_USR, @APELLIDO_USR, @CORREO_USR, 
        @CONTRASENA_USR, @FECHA_ALTA_USR, @ACTIVO_USR, @IMG_USR)
      `);

    await sendPasswordEmail(CORREO_USR, CONTRASENA_USR);

    res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al registrar el usuario." });
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
        IMG_USR 
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
    //console.log("📩 Recibiendo solicitud para actualizar usuario...");

    const { id } = req.params;
    const {
      TIPO_USR,
      NOMBRE_USR,
      APELLIDO_USR,
      CORREO_USR,
      ACTIVO_USR,
      CONTRASENA_USR,
    } = req.body;
    const imgFile = req.files?.IMG_USR;

    //console.log("📌 Datos recibidos:", { id, TIPO_USR, NOMBRE_USR, APELLIDO_USR, CORREO_USR, ACTIVO_USR, CONTRASENA_USR });

    if (!id || !TIPO_USR || !NOMBRE_USR || !APELLIDO_USR || !CORREO_USR) {
      console.error("❌ Faltan datos obligatorios");
      return res.status(400).json({
        message: "Todos los campos obligatorios deben ser proporcionados.",
      });
    }

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("ID_USR", sql.Int, id)
      .query("SELECT IMG_USR FROM USR_T WHERE ID_USR = @ID_USR");

    let imgFilename = result.recordset[0]?.IMG_USR || null;

    //console.log("📸 Imagen actual en BD:", imgFilename);

    if (imgFile) {
      //console.log("🖼️ Nueva imagen...");
      const uploadDir = path.join(process.cwd(), "uploads/pics");

      if (imgFilename) {
        const oldImagePath = path.join(uploadDir, path.basename(imgFilename));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          //console.log("🗑️ Imagen antigua eliminada:", oldImagePath);
        }
      }

      imgFilename =
        CORREO_USR.replace(/[@.]/g, "_") + path.extname(imgFile.name);
      const uploadPath = path.join(uploadDir, imgFilename);

      await imgFile.mv(uploadPath);
      //console.log("✅ Imagen guardada en:", uploadPath);

      imgFilename = `/uploads/pics/${imgFilename}`;
    }

    const isActive =
      ACTIVO_USR === "1" || ACTIVO_USR === 1 || ACTIVO_USR === true;
    //console.log("🟢 Estado de usuario (ACTIVO_USR):", isActive);

    let query = `
      UPDATE dbo.USR_T 
      SET 
        TIPO_USR = @TIPO_USR, 
        NOMBRE_USR = @NOMBRE_USR, 
        APELLIDO_USR = @APELLIDO_USR, 
        CORREO_USR = @CORREO_USR, 
        ACTIVO_USR = @ACTIVO_USR,
        IMG_USR = @IMG_USR
    `;

    if (CONTRASENA_USR && CONTRASENA_USR.trim() !== "") {
      //console.log("🔑 Nueva contraseña detectada, se actualizará...");
      query += `, CONTRASENA_USR = @CONTRASENA_USR`;
    } else {
      //console.log("🚫 No se proporcionó una nueva contraseña, no se actualizará.");
    }

    query += ` WHERE ID_USR = @ID_USR`;

    const request = pool
      .request()
      .input("ID_USR", sql.Int, parseInt(id, 10))
      .input("TIPO_USR", sql.Int, TIPO_USR)
      .input("NOMBRE_USR", sql.NVarChar(300), NOMBRE_USR)
      .input("APELLIDO_USR", sql.NVarChar(300), APELLIDO_USR)
      .input("CORREO_USR", sql.NVarChar(300), CORREO_USR)
      .input("ACTIVO_USR", sql.Bit, isActive)
      .input("IMG_USR", sql.NVarChar(300), imgFilename);

    if (CONTRASENA_USR && CONTRASENA_USR.trim() !== "") {
      request.input("CONTRASENA_USR", sql.NVarChar(300), CONTRASENA_USR);
    }

    /*console.log("🔵 Query generada:", query);
    console.log("🟢 Datos enviados al SQL:", {
      ID_USR: id,
      TIPO_USR,
      NOMBRE_USR,
      APELLIDO_USR,
      CORREO_USR,
      ACTIVO_USR,
      IMG_USR: imgFilename,
      CONTRASENA_USR: CONTRASENA_USR || "No se actualiza",
    });*/

    await request.query(query);

    //console.log("✅ Usuario actualizado correctamente.");
    res.json({ message: "Usuario actualizado correctamente." });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al actualizar el usuario." });
  }
};
