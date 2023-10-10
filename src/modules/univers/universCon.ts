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

export const serviceAdd = async (req: Request, res: Response) => {
    console.log("-> server - service: add new: ", req.body);
    try {
        const connection = await pool.getConnection();
        const checkService: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.SERVICES} WHERE service = ?`,
            [req.body.service]
        );
        /* if notduplicated */
        if (!checkService[0].length) {
            const result: any = await connection.query(
                `INSERT INTO ${DB_TABLE_LIST.SERVICES} (service, unit, unit_price) VALUES (?,?,?)`,
                [req.body.service, req.body.unit, req.body.unit_price]
            );
            connection.release();
            return res.status(200).json({
                status: RESPONSE_STATUS.SUCCESS,
                msg: "successed add new service",
                data: result[0],
            });
        } else {
            connection.release();
            return res.status(200).json({
                status: RESPONSE_STATUS.FAILED_DUP,
                msg: "service / unit already exists",
                data: "",
            });
        }
    } catch (error) {
        return res.status(403).json({
            status: RESPONSE_STATUS.FAILED,
            msg: "add new service failed",
            data: "",
        });
    }
};

export const unitAdd = async (req: Request, res: Response) => {
    console.log("-> server - unit: add new: ", req.body);
    try {
        const connection = await pool.getConnection();
        const checkUnit: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.UNITS} WHERE unit_name = ?`,
            [req.body.unit_name]
        );
        /* if notduplicated */
        if (!checkUnit[0].length) {
            const result: any = await connection.query(
                `INSERT INTO ${DB_TABLE_LIST.UNITS} (unit_name) VALUES (?)`,
                [req.body.unit_name]
            );
            connection.release();
            return res.status(200).json({
                status: RESPONSE_STATUS.SUCCESS,
                msg: "successed add new unit",
                data: result[0],
            });
        } else {
            connection.release();
            return res.status(200).json({
                status: RESPONSE_STATUS.FAILED_DUP,
                msg: "service / unit already exists",
                data: "",
            });
        }
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
