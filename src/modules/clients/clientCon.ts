import uuid from "uuid";
import { Request, Response } from "express";
import mysql, { Connection, createConnection } from "mysql2/promise";
import { DB_TABLE_LIST } from "../../utils/config";
import logger from "@/utils/logger";
import dotenv from "dotenv";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DATABASE,
    connectionLimit: 15,
});

const phaseClientsData = (items: any /* placeholder */) => {
    return items.map((item: any) => {
        const { first_name, surname, phone, email, address } = item;
        return [first_name, surname, phone, email, address];
    });
};

const clientMulInstert = async (req: Request, res: Response) => {
    console.log("server - client: multiple insert clients");
    try {
        const connection = await pool.getConnection();
        const insertData = phaseClientsData(req.body);

        const sql = `INSERT INTO ${DB_TABLE_LIST.CLIENT} (first_name, surname, phone, email, address) VALUES ?`;
        await connection.query(sql, [insertData]);
        connection.release();
        res.status(200).json({ msg: "success: insert multiple clients" });
    } catch (err) {
        logger.errLog(err);
        res.status(500).json({ msg: "Failed: create tables" });
    }
};

export { clientMulInstert };
