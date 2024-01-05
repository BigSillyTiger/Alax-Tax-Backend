import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const {
    MYSQL_HOST: HOST,
    MYSQL_USER: USER,
    MYSQL_PASSWORD: PW,
    MYSQL_DB: DB,
    MYSQL_PORT: PORT,
} = process.env;

const adminPool: Pool = mysql.createPool({
    host: HOST,
    user: USER,
    password: PW,
    database: DB,
    connectionLimit: 5,
    port: Number(PORT),
});

//const adminPool = mysql.createPool(process.env.JAWSDB_URL as string);

export default adminPool;
