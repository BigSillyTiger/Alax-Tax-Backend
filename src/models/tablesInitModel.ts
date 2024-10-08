import { DB_TABLE_LIST } from "../utils/config";
import logger from "../libs/logger";
import adminPool from "../config/adminPool";

export const createTables = async () => {
    try {
        const connection = await adminPool.getConnection();

        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.STAFF} (
        uid VARCHAR(4) NOT NULL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(50) NOT NULL,
        phone VARCHAR(25) NOT NULL,
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
        servicess TINYINT NOT NULL DEFAULT 0,
        calendar TINYINT NOT NULL DEFAULT 1,
        staff TINYINT NOT NULL DEFAULT 0,		
        setting TINYINT NOT NULL DEFAULT 0,
        access TINYINT NOT NULL DEFAULT 1,
        hr TINYINT NOT NULL DEFAULT 25,
        bsb VARCHAR(10),
        account VARCHAR(15),
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

        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.CLIENT} (
            cid VARCHAR(5) NOT NULL PRIMARY KEY,
            archive BOOLEAN DEFAULT FALSE NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            phone VARCHAR(25) NOT NULL,
            email VARCHAR(50) NOT NULL,
            address VARCHAR(255),
            suburb VARCHAR(100) DEFAULT 'Adelaide',
            city VARCHAR(100) DEFAULT 'Adelaide',
            state VARCHAR(10) DEFAULT 'SA',
            country VARCHAR(20) DEFAULT "Australia",
            postcode VARCHAR(10) DEFAULT '5000',
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.SERVICE} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            service VARCHAR(255) NOT NULL UNIQUE,
            unit VARCHAR(20),
            unit_price DECIMAL(8,2) UNSIGNED DEFAULT 0
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.UNIT} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            unit_name VARCHAR(20) NOT NULL UNIQUE
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.ORDER_LIST} (
            oid VARCHAR(11) NOT NULL PRIMARY KEY,
            fk_cid VARCHAR(5) NOT NULL,
            archive BOOLEAN DEFAULT FALSE NOT NULL,
            deleted Boolean DEFAULT FALSE NOT NULL,
            status VARCHAR(10) DEFAULT 'Pending',
            q_deposit DECIMAL(9,2) UNSIGNED DEFAULT 0,
            q_valid SMALLINT UNSIGNED DEFAULT 30,
            q_date TIMESTAMP DEFAULT NULL,
            total DECIMAL(10,2) UNSIGNED DEFAULT 0,
            gst DECIMAL(9,2) UNSIGNED DEFAULT 0,
            net DECIMAL(10,2) UNSIGNED DEFAULT 0,
            paid DECIMAL(10,2) UNSIGNED DEFAULT 0,
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            estimate_finish_date TIMESTAMP DEFAULT NULL,
            i_date TIMESTAMP DEFAULT NULL,
            note VARCHAR(512)
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.ORDER_SERVICE} (
            osid VARCHAR(11) NOT NULL PRIMARY KEY,
            fk_oid VARCHAR(11) NOT NULL,
            fk_cid VARCHAR(11) NOT NULL,
            title VARCHAR(255) NOT NULL,
            note VARCHAR(512),
            taxable BOOLEAN DEFAULT TRUE,
            qty DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT 1,
            unit VARCHAR(20) NOT NULL,
            unit_price DECIMAL(10,2) UNSIGNED NOT NULL,
            gst DECIMAL(9,2) UNSIGNED NOT NULL,
            net DECIMAL(10,2) UNSIGNED NOT NULL,
            ranking TINYINT UNSIGNED DEFAULT 0,
            status VARCHAR(10) DEFAULT 'Pending',
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expiry_date VARCHAR(10) DEFAULT 'none',
            archive BOOLEAN DEFAULT FALSE NOT NULL,
            deleted BOOLEAN DEFAULT FALSE NOT NULL,
            service_type VARCHAR(5) DEFAULT 'OOP',
            product_name VARCHAR(30) DEFAULT 'product'
        )`);
        await connection.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_LIST.PAYMENT} (
            pid VARCHAR(11) NOT NULL PRIMARY KEY,
            fk_oid VARCHAR(11) NOT NULL,
            paid DECIMAL(10,2) UNSIGNED DEFAULT 0,
            paid_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

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
