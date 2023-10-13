import { Request, Response } from "express";
import mysql, { Pool, PoolConnection } from "mysql2/promise";
import { DB_TABLE_LIST } from "../../utils/config";
import { createTables } from "../../models/tablesInitCtl";

import logger from "../../utils/logger";
import dotenv from "dotenv";

dotenv.config();

const dbInit = async (req: Request, res: Response) => {
    const pool: Pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DATABASE,
        connectionLimit: 5,
    });
    try {
        const connection = await pool.getConnection();
        const createTableManagers = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.MANAGERS} (
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
        const createTableClients = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.CLIENTS} (
            client_id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            phone VARCHAR(25) NOT NULL,
            email VARCHAR(255) NOT NULL,
            address VARCHAR(255),
            suburb VARCHAR(100),
            city VARCHAR(20) DEFAULT 'Adelaide',
            state VARCHAR(10) DEFAULT 'SA',
            country VARCHAR(20) DEFAULT "Australia",
            postcode VARCHAR(10) DEFAULT '5000',
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(phone, email)
        )`;
        const createTableServices = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.SERVICES} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            service VARCHAR(255) NOT NULL UNIQUE,
            unit VARCHAR(20),
            unit_price MEDIUMINT UNSIGNED DEFAULT 0
        )`;
        const createTableUnit = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.UNITS} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            unit_name VARCHAR(20) NOT NULL UNIQUE
        )`;

        const createTableOrders = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.ORDERS} (
            order_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            fk_client_id SMALLINT UNSIGNED,
            fk_invoice_id MEDIUMINT UNSIGNED,
            order_address  VARCHAR(255),
            order_suburb VARCHAR(100),
            order_city VARCHAR(20) DEFAULT 'Adelaide',
            order_state VARCHAR(10) DEFAULT 'SA',
            order_country VARCHAR(20) DEFAULT "Australia",
            order_pc VARCHAR(10) DEFAULT '5000',
            order_status VARCHAR(10) DEFAULT 'pending',
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
        const createTableOrderDesc = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.ORDER_DESC} (
            des_id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            fk_order_id SMALLINT UNSIGNED,
            ranking TINYINT UNSIGNED,
            description VARCHAR(255) NOT NULL,
            qty SMALLINT UNSIGNED NOT NULL DEFAULT 1,
            unit VARCHAR(20) NOT NULL,
            unit_price MEDIUMINT UNSIGNED NOT NULL,
            netto MEDIUMINT UNSIGNED NOT NULL
        )`;
        const createTableQuotations = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.QUOTATIONS} (
            fk_order_id SMALLINT UNSIGNED PRIMARY KEY,
            deposit MEDIUMINT UNSIGNED,
            discount VARCHAR(100),
            quotation_date TIMESTAMP,
            quotation_update TIMESTAMP
    )`;
        const createTableInvioces = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.INVOICES} (
            invoice_id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_date TIMESTAMP
        )`;
        const createTablePayments = `CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.PAYMENTS} (
            pay_id INT AUTO_INCREMENT PRIMARY KEY,
            fk_invoice_id MEDIUMINT UNSIGNED,
            paid MEDIUMINT UNSIGNED DEFAULT 0,
            paid_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        await connection.query(createTableManagers);
        await connection.query(createTableAdminLv);
        await connection.query(createTableClients);
        await connection.query(createTableServices);
        await connection.query(createTableUnit);
        await connection.query(createTableOrders);
        await connection.query(createTableOrderDesc);
        await connection.query(createTableQuotations);
        await connection.query(createTableInvioces);
        await connection.query(createTablePayments);

        connection.release();
        res.status(200).json({ msg: "success: create tables" });
    } catch (err) {
        logger.errLog(err);
        res.status(500).json({ msg: "Failed: create tables" });
    }
};

export { dbInit };
