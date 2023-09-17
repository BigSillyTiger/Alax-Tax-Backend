import { Request, Response } from "express";
import mysql, { Pool, PoolConnection } from "mysql2/promise";
import { URL_LIST, DB_TABLE_LIST } from "../../utils/config";
import dotenv from "dotenv";

import logger from "../../utils/logger";

dotenv.config();

const dbInit = async (req: Request, res: Response) => {
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
        const createTableManager = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.MANAGER} (
            uid INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            password VARCHAR(255) NOT NULL,
            address VARCHAR(255),
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        const createTableAdminLv = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.ADMIN_LEVEL} (
            admin_id INT AUTO_INCREMENT,
            fk_uid INT,
            dashboard TINYINT NOT NULL DEFAULT 2,
            clients TINYINT NOT NULL DEFAULT 2,
            orders TINYINT NOT NULL DEFAULT 2,
            calendar TINYINT NOT NULL DEFAULT 2,
            employees TINYINT NOT NULL DEFAULT 2,		
            management TINYINT NOT NULL DEFAULT 0,
            PRIMARY KEY (admin_id, fk_uid),
            FOREIGN KEY (fk_uid) REFERENCES ${DB_TABLE_LIST.MANAGER}(uid) ON UPDATE NO ACTION ON DELETE CASCADE
        )`;
        const createTableClient = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.CLIENT} (
            client_id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            email VARCHAR(255),
            address VARCHAR(255),
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(phone, email)
        )`;
        await connection.query(createTableManager);
        await connection.query(createTableAdminLv);
        await connection.query(createTableClient);
        connection.release();
        res.status(200).json({ msg: "success: create tables" });
    } catch (err) {
        logger.errLog(err);
        res.status(500).json({ msg: "Failed: create tables" });
    }
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

export { dbInit };
