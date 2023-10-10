import { Request, Response } from "express";
import mysql, { Pool, PoolConnection } from "mysql2/promise";
import { URL_LIST, DB_TABLE_LIST } from "../../utils/config";
import dotenv from "dotenv";

import logger from "../../utils/logger";

dotenv.config();

const dbInit = async (req: Request, res: Response) => {
    logger.infoLog(`db - create tabel: ${DB_TABLE_LIST.MANAGERS}`);
    const pool: Pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DATABASE,
        connectionLimit: 5,
    });
    try {
        const connection = await pool.getConnection();
        const createTableManager = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.MANAGERS} (
            uid INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
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
            FOREIGN KEY (fk_uid) REFERENCES ${DB_TABLE_LIST.MANAGERS}(uid) ON UPDATE NO ACTION ON DELETE CASCADE
        )`;
        const createTableClient = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.CLIENTS} (
            client_id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            phone VARCHAR(25) NOT NULL,
            email VARCHAR(255) NOT NULL,
            address VARCHAR(255),
            city VARCHAR(20) DEFAULT 'Adelaide',
            state VARCHAR(20) DEFAULT 'SA',
            country VARCHAR(20) DEFAULT "Australia",
            postcode VARCHAR(10) DEFAULT '5000',
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(phone, email)
        )`;
        const createViewAllClient = `CREATE OR REPLACE VIEW ${DB_TABLE_LIST.VIEW_CLIENTS} AS 
            SELECT
                client_id AS id,
                CONCAT(first_name, ' ', last_name) AS full_name,
                phone,
                email,
                address,
                city,
                state,
                country,
                postcode
            FROM
                ${DB_TABLE_LIST.CLIENTS};`;
        const createTableService = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.SERVICES} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            service VARCHAR(255) NOT NULL UNIQUE,
            unit VARCHAR(20),
            unit_price MEDIUMINT UNSIGNED DEFAULT 0
        )`;
        const createTableUnit = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.UNITS} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            unit_name VARCHAR(20) NOT NULL UNIQUE
        )`;
        await connection.query(createTableManager);
        await connection.query(createTableAdminLv);
        await connection.query(createTableClient);
        await connection.query(createTableService);
        await connection.query(createTableUnit);
        await connection.query(createViewAllClient);

        connection.release();
        res.status(200).json({ msg: "success: create tables" });
    } catch (err) {
        logger.errLog(err);
        res.status(500).json({ msg: "Failed: create tables" });
    }
};

export { dbInit };
