import { Request, Response } from "express";
import mysql, { Pool, PoolConnection } from "mysql2/promise";
import { URL_LIST, ALAX_DB_CONFIG, DB_TABLE_LIST } from "../../utils/config";

import logger from "../../utils/logger";

/* const createDB = async (req: Request, res: Response) => {
    logger.infoLog(`db - create database: ${ALAX_DB_CONFIG.database}`);
    const pool: Pool = mysql.createPool(ALAX_DB_CONFIG);
    try {
        const connection = await pool.getConnection();
        const createDB = `CREATE DATABASE IF NOT EXISTS ${ALAX_DB_CONFIG.database}`;
        await connection.query(createDB);
        connection.release();
        res.status(200).json({
            success: `success: create database ${ALAX_DB_CONFIG.database}`,
        });
    } catch (err) {
        logger.errLog(err);
        res.status(500).json({
            error: `Failed: create database ${ALAX_DB_CONFIG.database}`,
        });
    }
}; */

const createTableManager = async (req: Request, res: Response) => {
    logger.infoLog(`db - create tabel: ${DB_TABLE_LIST.MANAGER}`);
    const pool: Pool = mysql.createPool({
        ...ALAX_DB_CONFIG,
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
