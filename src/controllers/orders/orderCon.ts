import uuid from "uuid";
import type { Request, Response } from "express";
import mysql from "mysql2/promise";
import { DB_TABLE_LIST, RESPONSE_STATUS } from "../../utils/config";
import logger from "../../utils/logger";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DATABASE,
    connectionLimit: 15,
});

export const orderAll = async (req: Request, res: Response) => {
    try {
        const connection = await pool.getConnection();
        const result = await pool.query(
            `SELECT * FROM ${DB_TABLE_LIST.ORDERS}`
        );
        connection.release();
        return res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            msg: "successed retrieve all orders",
            data: result[0],
        });
    } catch (err) {
        logger.errLog(err);
        return res.status(400).json({
            status: RESPONSE_STATUS.FAILED,
            msg: "Failed: retrieve all orders",
            data: null,
        });
    }
};

export const orderAdd = async (req: Request, res: Response) => {};

export const orderDel = async (req: Request, res: Response) => {};

export const orderUpdate = async (req: Request, res: Response) => {};
