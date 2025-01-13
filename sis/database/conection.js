import sql from "mssql";
import config from "../config/config.js";

export const dbSettings = {
  user: config.dbUser,
  password: config.dbPassword,
  server: config.dbServer,
  port: parseInt(config.dbPort, 10),
  database: config.dbDatabase,
  options: {
    trustServerCertificate: true,
    // Use for Azure SQL or if encryption is required
    //     encrypt: true,
    // Required for self-signed certificates
  },
};

export async function getConnection() {
  try {
    const connection = await sql.connect(dbSettings);
    console.log("Connected to the database");
    return connection;
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    throw err;
  }
}

export { sql };
