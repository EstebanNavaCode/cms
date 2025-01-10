import {config} from "dotenv";

config();

export default {
    port: process.env.PORT || 3001,
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbServer: process.env.DB_SERVER || '',
    dbPort: process.env.DB_PORT || 1433, // Puerto predeterminado de SQL Server
    dbDatabase: process.env.DB_DATABASE || '',
};
