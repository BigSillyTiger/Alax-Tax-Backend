import { DB_TABLE_LIST } from "../utils/config";
import logger from "../utils/logger";
import adminPool from "./adminPool";

export const createTables = async () => {
    console.log("-> test 1");
    try {
        const connection = await adminPool.getConnection();
        console.log("-> test 2");
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.STAFF} (
        uid VARCHAR(4) NOT NULL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        suburb VARCHAR(100) DEFAULT 'Adelaide',
        city VARCHAR(100) DEFAULT 'Adelaide',
        state VARCHAR(10) DEFAULT 'SA',
        country VARCHAR(20) DEFAULT "Australia",
        postcode VARCHAR(10) DEFAULT '5000',
        role VARCHAR(10) NOT NULL DEFAULT 'employee',
        archive BOOLEAN DEFAULT FALSE NOT NULL,
        dashboard TINYINT NOT NULL DEFAULT 2,
        clients TINYINT NOT NULL DEFAULT 0,
        orders TINYINT NOT NULL DEFAULT 0,
        calendar TINYINT NOT NULL DEFAULT 1,
        staff TINYINT NOT NULL DEFAULT 0,		
        setting TINYINT NOT NULL DEFAULT 0,
        access TINYINT NOT NULL DEFAULT 1,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.COMPANY} (
            id TINYINT UNSIGNED PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            bld VARCHAR(20),
            phone VARCHAR(25) NOT NULL,
            email VARCHAR(255) NOT NULL,
            address VARCHAR(255),
            abn VARCHAR(15) NOT NULL,
            bsb VARCHAR(15) NOT NULL ,
            acc  VARCHAR(25) NOT NULL
        )`);

        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.CLIENTS} (
            cid VARCHAR(5) NOT NULL PRIMARY KEY,
            archive BOOLEAN DEFAULT FALSE NOT NULL,
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
            unit_price DECIMAL(8,2) UNSIGNED DEFAULT 0
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.UNITS} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            unit_name VARCHAR(20) NOT NULL UNIQUE
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.ORDERS} (
            oid VARCHAR(11) NOT NULL PRIMARY KEY,
            archive BOOLEAN DEFAULT FALSE NOT NULL,
            fk_cid VARCHAR(5) NOT NULL,
            address VARCHAR(255),
            suburb VARCHAR(100) DEFAULT 'Adelaide',
            city VARCHAR(20) DEFAULT 'Adelaide',
            state VARCHAR(20) DEFAULT 'SA',
            country VARCHAR(20) DEFAULT "Australia",
            postcode VARCHAR(10) DEFAULT '5000',
            status VARCHAR(10) DEFAULT 'Pending',
            total DECIMAL(10,2) UNSIGNED DEFAULT 0,
            gst DECIMAL(9,2) UNSIGNED DEFAULT 0,
            deposit DECIMAL(9,2) UNSIGNED DEFAULT 0,
            paid DECIMAL(10,2) UNSIGNED DEFAULT 0,
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            quotation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.ORDER_SERVICES} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fk_oid VARCHAR(11) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(1000),
            qty SMALLINT UNSIGNED NOT NULL DEFAULT 1,
            unit VARCHAR(20) NOT NULL,
            unit_price DECIMAL(10,2) UNSIGNED NOT NULL,
            gst DECIMAL(9,2) UNSIGNED NOT NULL,
            netto DECIMAL(10,2) UNSIGNED NOT NULL
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.PAYMENTS} (
            pid INT AUTO_INCREMENT PRIMARY KEY,
            fk_oid VARCHAR(11) NOT NULL,
            paid DECIMAL(10,2) UNSIGNED DEFAULT 0,
            paid_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.WORK_LOGS} (
            wlid VARCHAR(11) NOT NULL PRIMARY KEY,
            fk_oid VARCHAR(11) NOT NULL,
            fk_uid VARCHAR(4) NOT NULL,
            wl_date DATE NOT NULL,
            s_time TIME,
            e_time TIME,
            b_time TIME,
            b_hour TIME,
            wl_status VARCHAR(20) NOT NULL DEFAULT 'pending',
            wl_note VARCHAR(500),
            confirm_status TINYINT(1) DEFAULT 0,
            archive BOOLEAN DEFAULT FALSE NOT NULL
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
