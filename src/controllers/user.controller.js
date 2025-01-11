import { getConnection } from "../../sis/database/conection.js";
import sql from "mssql";

export const renderLogin = (req, res) => {
    res.render("home/home"); // Renderiza la vista del formulario de inicio de sesión
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


