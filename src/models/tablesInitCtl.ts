import { DB_TABLE_LIST } from "../utils/config";
import logger from "../utils/logger";
import adminPool from "./adminPool";

export const createTables = async () => {
    try {
        const connection = await adminPool.getConnection();
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.MANAGERS} (
        uid INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.ADMIN_LEVEL} (
            admin_id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            fk_uid TINYINT UNSIGNED UNIQUE,
            dashboard TINYINT NOT NULL DEFAULT 2,
            clients TINYINT NOT NULL DEFAULT 2,
            orders TINYINT NOT NULL DEFAULT 2,
            calendar TINYINT NOT NULL DEFAULT 2,
            employees TINYINT NOT NULL DEFAULT 2,		
            management TINYINT NOT NULL DEFAULT 0
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.CLIENTS} (
            client_id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            phone VARCHAR(25) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            address VARCHAR(255),
            suburb VARCHAR(100) DEFAULT 'Adelaide',
            city VARCHAR(100) DEFAULT 'Adelaide',
            state VARCHAR(10) DEFAULT 'SA',
            country VARCHAR(20) DEFAULT "Australia",
            postcode VARCHAR(10) DEFAULT '5000',
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.SERVICES} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            service VARCHAR(255) NOT NULL UNIQUE,
            unit VARCHAR(20),
            unit_price MEDIUMINT UNSIGNED DEFAULT 0
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.UNITS} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            unit_name VARCHAR(20) NOT NULL UNIQUE
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.ORDERS} (
            order_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            fk_client_id SMALLINT UNSIGNED,
            fk_invoice_id MEDIUMINT UNSIGNED,
            order_address  VARCHAR(255),
            order_suburb VARCHAR(100) DEFAULT 'Adelaide',
            order_city VARCHAR(20) DEFAULT 'Adelaide',
            order_state VARCHAR(20) DEFAULT 'SA',
            order_country VARCHAR(20) DEFAULT "Australia",
            order_pc VARCHAR(10) DEFAULT '5000',
            order_status VARCHAR(10) DEFAULT 'Pending',
            order_total MEDIUMINT UNSIGNED DEFAULT 0,
            order_gst MEDIUMINT UNSIGNED DEFAULT 0,
            order_deposit MEDIUMINT UNSIGNED DEFAULT 0,
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            quotation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            invoice_issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            invoice_update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.ORDER_DESC} (
            des_id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            fk_order_id SMALLINT UNSIGNED,
            ranking TINYINT UNSIGNED,
            description VARCHAR(255) NOT NULL,
            qty SMALLINT UNSIGNED NOT NULL DEFAULT 1,
            unit VARCHAR(20) NOT NULL,
            unit_price MEDIUMINT UNSIGNED NOT NULL,
            gst MEDIUMINT UNSIGNED NOT NULL,
            netto MEDIUMINT UNSIGNED NOT NULL
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.QUOTATIONS} (
            fk_order_id SMALLINT UNSIGNED PRIMARY KEY,
            deposit MEDIUMINT UNSIGNED,
            discount VARCHAR(100),
            quotation_date TIMESTAMP,
            quotation_update TIMESTAMP
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.INVOICES} (
            invoice_id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            discount VARCHAR(100),
            issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_date TIMESTAMP
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.PAYMENTS} (
            pay_id INT AUTO_INCREMENT PRIMARY KEY,
            fk_invoice_id MEDIUMINT UNSIGNED,
            paid MEDIUMINT UNSIGNED DEFAULT 0,
            paid_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        //await connection.query();
        connection.release();
        return true;
    } catch (err) {
        console.log("Err: create tables: ", err);
        return false;
    }
};

export const testAPI = async () => {
    try {
        const connection = await adminPool.getConnection();
        await connection.query(`CREATE TABLE IF NOT EXISTS tests (
        uid INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL)`);
        console.log("-> test api OK ");
        connection.release();
        return { msg: "test ok" };
    } catch (err) {
        console.log("-> test api error: ", err);
        return { msg: "test failed" };
    }
};
