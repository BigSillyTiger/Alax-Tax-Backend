import uuid from "uuid";
import { Request, Response } from "express";
import mysql, { Connection, createConnection } from "mysql2/promise";
import { DB_TABLE_LIST } from "../../utils/config";
import logger from "../../utils/logger";
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
        const { first_name, last_name, phone, email, address } = item;
        return [first_name, last_name, phone, email, address];
    });
};

const clientMulInstert = async (req: Request, res: Response) => {
    console.log("server - client: multiple insert clients ");
    try {
        const connection = await pool.getConnection();
        const insertData = phaseClientsData(req.body);
        console.log("-> parsed data: ", insertData);

        const sql = `INSERT INTO ${DB_TABLE_LIST.CLIENT} (first_name, last_name, phone, email, address) VALUES ?`;
        await connection.query(sql, [insertData]);
        connection.release();
        res.status(200).json({ msg: "success: insert multiple clients" });
    } catch (error: any) {
        logger.errLog(error);
        if (error?.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "Duplicate phone number. Data not inserted.",
            });
        }
        return res.status(400).json({ msg: "Failed: insert multiple clients" });
    }
};

const clientGetAll = async (req: Request, res: Response) => {
    console.log("-> server - client: all");
    try {
        const connection = await pool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.V_ALL_CLIENTS}`
        );
        //console.log("-> ALL client from server: ", result);
        connection.release();
        return res.status(200).json({
            status: true,
            msg: "successed retrieve all client",
            data: result[0],
        });
    } catch (error) {
        return res.status(403).json({
            status: false,
            msg: "acquire all client failed",
        });
    }
};

export { clientMulInstert, clientGetAll };
