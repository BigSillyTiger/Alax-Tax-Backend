import uuid from "uuid";
import type { Request, Response } from "express";
import mysql from "mysql2/promise";
import { DB_TABLE_LIST, RES_STATUS } from "../../utils/config";
import {
    m_getCompany,
    m_updateCompany,
    m_insertCompany,
} from "../../models/settingModel";
import dotenv from "dotenv";
import { convertToFloat } from "../../libs/format";

dotenv.config();

const {
    ADDR: serverAddr,
    MYSQL_HOST: HOST,
    MYSQL_USER: USER,
    MYSQL_PASSWORD: PW,
    MYSQL_DB: DB,
    MYSQL_PORT: PORT,
    PORT: LPORT,
} = process.env;

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    connectionLimit: 15,
});
//const pool = mysql.createPool(process.env.JAWSDB_URL as string);

export const universAll = async (req: Request, res: Response) => {
    console.log("-> server - manage: service all");
    try {
        const connection = await pool.getConnection();
        const sResult: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.SERVICE}`
        );
        const uResult: any = await connection.query(`
            SELECT * FROM ${DB_TABLE_LIST.UNIT}`);

        connection.release();
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "successed retrieve all services",
            data: { services: sResult[0], units: uResult[0] },
        });
    } catch (error) {
        console.log("-> univers all error: ", error);
        return res.status(403).json({
            status: RES_STATUS.FAILED,
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
                `INSERT INTO ${DB_TABLE_LIST.SERVICE} (service, unit, unit_price) VALUES (?,?,?)`,
                [req.body.service, req.body.unit, req.body.unit_price]
            );
        } else {
            const result = await connection.query(
                `INSERT INTO ${DB_TABLE_LIST.UNIT} (unit_name) VALUES (?)`,
                [req.body.unit_name]
            );
        }
        connection.release();
        return res.status(200).json({
            status: RES_STATUS.SUC_ADD_NEW_SU,
            msg: "successed add new service / unit",
            data: "",
        });
    } catch (error) {
        return res.status(403).json({
            status: RES_STATUS.FAILED_ADD_NEW_SU,
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
                ? DB_TABLE_LIST.SERVICE
                : DB_TABLE_LIST.UNIT;
        const result: any = await connection.query(
            `DELETE FROM ${table} WHERE id = ?`,
            [req.body.id]
        );
        connection.release();
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "successed delete service / unit",
            data: result[0],
        });
    } catch (error) {
        return res.status(403).json({
            status: RES_STATUS.FAILED,
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
                `UPDATE ${DB_TABLE_LIST.SERVICE} SET service = ?, unit = ?, unit_price = ? WHERE id = ?`,
                [
                    req.body.service,
                    req.body.unit,
                    req.body.unit_price,
                    req.body.id,
                ]
            );
        } else {
            const result: any = await connection.query(
                `UPDATE ${DB_TABLE_LIST.UNIT} SET unit_name = ? WHERE id = ?`,
                [req.body.unit_name, req.body.id]
            );
        }
        connection.release();
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "successed edit service / unit",
            data: "",
        });
    } catch (error) {
        return res.status(403).json({
            status: RES_STATUS.FAILED,
            msg: "edit service / unit failed",
            data: "",
        });
    }
};

export const getCompany = async (req: Request, res: Response) => {
    console.log("-> server - company: get company info");
    const result = await m_getCompany();

    return res.status(200).json({
        status: RES_STATUS.SUCCESS,
        msg: "successed get company info",
        //data: { ...result, deposit_rate: convertToFloat(result.deposit_rate) },
        data: result,
    });
};

export const updateCompany = async (req: Request, res: Response) => {
    console.log("-> server - company: update company info: ", req.body);
    try {
        let affectRows: any;
        if (req.body.id) {
            // update
            const result = await m_updateCompany(req.body);
            affectRows = result.affectedRows;
        } else {
            const result = await m_insertCompany(req.body);
            affectRows = result.affectedRows;
        }
        if (affectRows) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_COMPANY,
                msg: "successed updated company info",
                data: "",
            });
        } else {
            throw new Error("update company info failed");
        }
    } catch (error) {
        return res.status(403).json({
            status: RES_STATUS.FAILED,
            msg: "Faile: update company info",
            data: "",
        });
    }
};

export const updateLogo = async (req: Request, res: Response) => {
    console.log("-> server - company: update logo ");
    const logo = req.file;
    if (logo) {
        return res.status(200).json({
            status: RES_STATUS.SUC_UPDATE_LOGO,
            msg: "successed: updating logo",
            data: `https://${serverAddr}/logo/${logo.filename}`,
            //data: `http://${serverAddr}:${LPORT}/logo/${logo.filename}`,
        });
    }
};

export const getLogo = async (req: Request, res: Response) => {
    console.log("-> server - company: get logo: ", req.body.logoFile[0]);

    return res.status(200).json({
        status: RES_STATUS.SUCCESS,
        msg: "successed: get logo",
        data: `https://${serverAddr}/logo/${req.body.logoFile[0]}`,
        //data: `http://${serverAddr}:${LPORT}/logo/${req.body.logoFile[0]}`,
    });
};
