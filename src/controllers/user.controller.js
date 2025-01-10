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
        "SELECT * FROM USR_T WHERE USR_EMAIL = @email AND USR_PWD = @password"
      );

    if (result.recordset.length > 0) {
      res.redirect("/dashboard");
      res.status(200).json({ sucess: true, message: "Usuario autenticado" }); // Pass user data to the view
    } else {
      res
        .status(401)
        .json({ sucess: false, message: "Usuario o contraseña incorrectos" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ sucess: false, message: "Error al ingresar al sistema" });
  }
};

