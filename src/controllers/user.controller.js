import { getConnection } from "../../sis/database/conection.js";

import path from "path";
import fs from "fs";
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
      res.redirect("/dashboard");
    } else {
      res.status(401).render("home/home", {
        error: "Usuario o contraseña incorrectos",
      });
    }
  } catch (err) {
    res.status(500).render("home/home", {
      error: "Error al ingresar al sistema. Inténtalo de nuevo.",
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    const {
      TIPO_USR,
      NOMBRE_USR,
      APELLIDO_USR,
      CORREO_USR,
      CONTRASENA_USR,
      IMG_USR,
    } = req.body;
    console.log("Datos recibidos en el backend:", req.body);
    console.log("Archivo recibido:", req.file);
    if (
      !TIPO_USR ||
      !NOMBRE_USR ||
      !APELLIDO_USR ||
      !CORREO_USR ||
      !CONTRASENA_USR
    ) {
      return res.status(400).json({
        message: "Todos los campos obligatorios deben ser proporcionados.",
      });
    }

    const pool = await getConnection();

    await pool
      .request()
      .input("TIPO_USR", sql.Int, TIPO_USR)
      .input("NOMBRE_USR", sql.NVarChar(300), NOMBRE_USR)
      .input("APELLIDO_USR", sql.NVarChar(300), APELLIDO_USR)
      .input("CORREO_USR", sql.NVarChar(300), CORREO_USR)
      .input("CONTRASENA_USR", sql.NVarChar(300), CONTRASENA_USR)
      .input("FECHA_ALTA_USR", sql.Date, new Date())
      .input("ACTIVO_USR", sql.Bit, true)
      .input("IMG_USR", sql.NVarChar(300), IMG_USR || null).query(`
        INSERT INTO dbo.USR_T
        (TIPO_USR, NOMBRE_USR, APELLIDO_USR, CORREO_USR, CONTRASENA_USR, FECHA_ALTA_USR, ACTIVO_USR, IMG_USR)
        VALUES (@TIPO_USR, @NOMBRE_USR, @APELLIDO_USR, @CORREO_USR, @CONTRASENA_USR, @FECHA_ALTA_USR, @ACTIVO_USR, @IMG_USR)
      `);

    res.redirect("/users");
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
        ACTIVO_USR
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
    const {
      TIPO_USR,
      NOMBRE_USR,
      APELLIDO_USR,
      CORREO_USR,
      ACTIVO_USR,
    } = req.body;

    if (!id || !TIPO_USR || !NOMBRE_USR || !APELLIDO_USR || !CORREO_USR) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben ser proporcionados." });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("ID_USR", sql.Int, parseInt(id, 10))
      .input("TIPO_USR", sql.Int, TIPO_USR)
      .input("NOMBRE_USR", sql.NVarChar(300), NOMBRE_USR)
      .input("APELLIDO_USR", sql.NVarChar(300), APELLIDO_USR)
      .input("CORREO_USR", sql.NVarChar(300), CORREO_USR)
      .input("ACTIVO_USR", sql.Bit, ACTIVO_USR)
      .query(`
        UPDATE dbo.USR_T 
        SET 
          TIPO_USR = @TIPO_USR, 
          NOMBRE_USR = @NOMBRE_USR, 
          APELLIDO_USR = @APELLIDO_USR, 
          CORREO_USR = @CORREO_USR, 
          ACTIVO_USR = @ACTIVO_USR
        WHERE ID_USR = @ID_USR
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Usuario no encontrado o no se realizó ninguna modificación." });
    }

    res.json({ message: "Usuario actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Ocurrió un error al actualizar el usuario." });
  }
};




