import { Request, Response } from "express";
import mysql, { Pool, PoolConnection } from "mysql2/promise";
import { URL_LIST, DB_TABLE_LIST } from "../../utils/config";
import dotenv from "dotenv";

import logger from "../../utils/logger";

dotenv.config();

const createTableManager = async (req: Request, res: Response) => {
    logger.infoLog(`db - create tabel: ${DB_TABLE_LIST.MANAGER}`);
    const pool: Pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DATABASE,
        connectionLimit: 5,
    });
    try {
        const connection = await pool.getConnection();
        const createTable = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.MANAGER} (
            uid INT PRIMARY KEY AUTO_INCREMENT,
            first_name VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            account VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            address VARCHAR(255),
            email VARCHAR(255) NOT NULL,
            created_date DATETIME
        )`;
        await connection.query(createTable);
        connection.release();
        res.status(200).json({ msg: "success: create table manager" });
    } catch (err) {
        logger.errLog(err);
        res.status(500).json({ msg: "Failed: create table manager" });
    }

    res.status(200).json({ msg: "created db table: manager" });
};

/* template
const __ = async (req: Request, res: Response) => {
    logger.infoLog(`db - **: ${}`);
    const pool: Pool = mysql.createPool(ALAX_DB_CONFIG);
    try {
        const connection = await pool.getConnection();
        const createDB = ``;
        await connection.query(createDB);
        connection.release();
        res.status(200).json({
            success: `success: * ${}`,
        });
    } catch (err) {
        logger.errLog(err);
        res.status(500).json({
            error: `Failed: * ${}`,
        });
    }
};
*/

export { createTableManager };
