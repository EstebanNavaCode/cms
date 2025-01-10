import sql from "mssql";
import config from "../config/config.js";

export const dbSettings = {
    user: config.dbUser, // Updated to match config.js
    password: config.dbPassword, // Updated to match config.js
    server: config.dbServer, // Updated to match config.js
    port: parseInt(config.dbPort, 10), // Ensure port is parsed as a number
    database: config.dbDatabase, // Updated to match config.js
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
};

export { sql };
