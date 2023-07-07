import express, { Request, Response } from "express";
import mysql, { Pool, PoolConnection } from "mysql2/promise";

import logger from "../utils/logger";
import { URL_LIST, ALAX_DB_CONFIG } from "../utils/config";
import * as authCtl from "../modules/auth/authCon";

const router = express.Router();

const createDB = async (req: Request, res: Response) => {
    const pool: Pool = mysql.createPool(ALAX_DB_CONFIG);
    try {
        const connection = await pool.getConnection();

        //const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS alax_tax_database`;
        const insertTable = `create table if not exists ${ALAX_DB_CONFIG.database}(
            id int primary key auto_increment,
            title varchar(255)not null,
            completed tinyint(1) not null default 0
        )`;
        //await connection.query(createDatabaseQuery);
        await connection.query(insertTable);
        connection.release();
        res.status(200).json({ success: "created table " });
    } catch (err) {
        logger.errLog(err);
        res.status(500).json({ error: "create table error" });
    }
};

const insertDB = async (req: Request, res: Response) => {
    const pool: Pool = mysql.createPool(ALAX_DB_CONFIG);
    const connection = await pool.getConnection();
    const stmt = `INSERT INTO ${ALAX_DB_CONFIG.database}(title, completed) VALUES ?`;
    const data = [
        ["data 1", false],
        ["data 2", true],
        ["data 3", false],
        ["data 4", true],
    ];
    try {
        await connection.query(stmt, [data]);
        connection.release();
        res.status(200).json({ success: "inserted data" });
    } catch (err) {
        logger.errLog(err);
        res.status(500).json({ success: "Error: inserted data" });
    }
};

const selectData = async (req: Request, res: Response) => {
    const pool: Pool = mysql.createPool(ALAX_DB_CONFIG);
    const connection = await pool.getConnection();
    const sql = `SELECT * FROM ${ALAX_DB_CONFIG.database}`;
    try {
        const [rows, fields]: [mysql.RowDataPacket[], mysql.FieldPacket[]] =
            await connection.query(sql);
        //const content = JSON.stringify(rows);
        //console.log(rows as [mysql.RowDataPacket[]]);
        //console.log(content);
        console.log(rows.length);

        connection.release();
        res.status(200).json({ success: "slected data" });
    } catch (err) {
        logger.errLog("select err: " + err);
        res.status(500).json({ err: "Error: select data" });
    }
};

router.get("/test_create_table", createDB);
router.get("/test_insert_data", insertDB);
router.get("/test_select_all", selectData);

export default router;
