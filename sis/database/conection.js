import sql from "mssql";
import config from "../config/config.js";

export const dbSettings = {
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    server: config.DB_SERVER,
    port: config.DB_PORT,
    database: config.DB_DATABASE,
    //for azure sql
    // options: {
    //     encrypt: true,
    //     trustServerCertificate: true,
    // },
};

export async function getConnection() {
    try{
        const connection = await sql.connect(dbSettings);
        console.log('Connected to the database');
        return connection;
    }catch(err){
        console.log('Error connecting to the database');
        throw err;  
    }
};

export {sql};