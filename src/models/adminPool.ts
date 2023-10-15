import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const adminPool: Pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DATABASE,
    connectionLimit: 5,
});

export default adminPool;
