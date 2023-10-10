import uuid from "uuid";
import type { Request, Response } from "express";
import mysql from "mysql2/promise";
import logger from "@/utils/logger";
import { DB_TABLE_LIST, RESPONSE_STATUS } from "../../utils/config";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DATABASE,
    connectionLimit: 15,
});

export const universAll = async (req: Request, res: Response) => {
    console.log("-> server - manage: service all");
    try {
        const connection = await pool.getConnection();
        const sResult: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.SERVICES}`
        );
        const uResult: any = await connection.query(`
            SELECT * FROM ${DB_TABLE_LIST.UNITS}`);

        connection.release();
        return res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            msg: "successed retrieve all services",
            data: { services: sResult[0], units: uResult[0] },
        });
    } catch (error) {
        console.log("-> univers all error: ", error);
        return res.status(403).json({
            status: RESPONSE_STATUS.FAILED,
            msg: "acquire all services failed",
            data: "",
        });
    }
};

export const uniAdd = async (req: Request, res: Response) => {
    console.log("-> server - service / unit add ");
    try {
        const connection = await pool.getConnection();
        if (req.body.service) {
            const result: any = await connection.query(
                `INSERT INTO ${DB_TABLE_LIST.SERVICES} (service, unit, unit_price) VALUES (?,?,?)`,
                [req.body.service, req.body.unit, req.body.unit_price]
            );
        } else {
            const result = await connection.query(
                `INSERT INTO ${DB_TABLE_LIST.UNITS} (unit_name) VALUES (?)`,
                [req.body.unit_name]
            );
        }
        connection.release();
        return res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            msg: "successed add new service / unit",
            data: "",
        });
    } catch (error) {
        return res.status(403).json({
            status: RESPONSE_STATUS.FAILED,
            msg: "add new unit failed",
            data: "",
        });
    }
};

export const uniDel = async (req: Request, res: Response) => {
    console.log("-> server - service: delete: ", req.body.id);
    try {
        const connection = await pool.getConnection();
        const table =
            req.body.type === "service"
                ? DB_TABLE_LIST.SERVICES
                : DB_TABLE_LIST.UNITS;
        const result: any = await connection.query(
            `DELETE FROM ${table} WHERE id = ?`,
            [req.body.id]
        );
        connection.release();
        return res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            msg: "successed delete service / unit",
            data: result[0],
        });
    } catch (error) {
        return res.status(403).json({
            status: RESPONSE_STATUS.FAILED,
            msg: "delete service / unit failed",
            data: "",
        });
    }
};

export const uniEdit = async (req: Request, res: Response) => {
    console.log("-> server - service: edit: ", req.body);
    try {
        const connection = await pool.getConnection();
        if (req.body.service) {
            const result: any = await connection.query(
                `UPDATE ${DB_TABLE_LIST.SERVICES} SET service = ?, unit = ?, unit_price = ? WHERE id = ?`,
                [
                    req.body.service,
                    req.body.unit,
                    req.body.unit_price,
                    req.body.id,
                ]
            );
        } else {
            const result: any = await connection.query(
                `UPDATE ${DB_TABLE_LIST.UNITS} SET unit_name = ? WHERE id = ?`,
                [req.body.unit_name, req.body.id]
            );
        }
        connection.release();
        return res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            msg: "successed edit service / unit",
            data: "",
        });
    } catch (error) {
        return res.status(403).json({
            status: RESPONSE_STATUS.FAILED,
            msg: "edit service / unit failed",
            data: "",
        });
    }
};
