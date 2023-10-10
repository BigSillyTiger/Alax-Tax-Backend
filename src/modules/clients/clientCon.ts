import uuid from "uuid";
import type { Request, Response } from "express";
import mysql, { Connection, createConnection } from "mysql2/promise";
import { DB_TABLE_LIST, RESPONSE_STATUS } from "../../utils/config";
import logger from "../../utils/logger";
import dotenv from "dotenv";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DATABASE,
    connectionLimit: 15,
});

type clientType = {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postcode: number;
};

const formatNewClient = async ({
    first_name,
    last_name,
    phone,
    email,
    address,
    city,
    state,
    country,
    postcode,
}: clientType) => {
    return [
        first_name,
        last_name,
        phone,
        email,
        address,
        city,
        state,
        country,
        postcode,
    ];
};

const phaseClientsData = (items: any /* placeholder */) => {
    return items.map((item: any) => {
        const {
            first_name,
            last_name,
            phone,
            email,
            address,
            city,
            state,
            country,
            postcode,
        } = item;
        return [
            first_name,
            last_name,
            phone,
            email,
            address,
            city,
            state,
            country,
            postcode,
        ];
    });
};

export const clientMulInstert = async (req: Request, res: Response) => {
    console.log("server - client: multiple insert clients ");
    try {
        const connection = await pool.getConnection();
        const insertData = phaseClientsData(req.body);
        //console.log("-> parsed data: ", insertData);

        const sql = `INSERT INTO ${DB_TABLE_LIST.CLIENTS} (first_name, last_name, phone, email, address, city, state, country, postcode) VALUES ?`;
        await connection.query(sql, [insertData]);
        connection.release();
        res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            msg: "success: insert multiple clients",
            data: "",
        });
    } catch (error: any) {
        logger.errLog(error);
        if (error?.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                status: RESPONSE_STATUS.FAILED,
                msg: "Duplicate phone number. Data not inserted.",
                data: null,
            });
        }
        return res.status(400).json({
            status: RESPONSE_STATUS.FAILED,
            msg: "Failed: insert multiple clients",
            data: null,
        });
    }
};

export const clientGetAll = async (req: Request, res: Response) => {
    console.log("-> server - client: all");
    try {
        const connection = await pool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.VIEW_CLIENTS}`
        );
        //console.log("-> ALL client from server: ", result);
        connection.release();
        return res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            msg: "successed retrieve all client",
            data: result[0],
        });
    } catch (error) {
        return res.status(403).json({
            status: RESPONSE_STATUS.FAILED,
            msg: "acquire all client failed",
            data: "",
        });
    }
};

export const clientInfo = async (req: Request, res: Response) => {
    console.log("-> server - client: info - ", req.body.id);
    try {
        const connection = await pool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.VIEW_CLIENTS} WHERE id = ?`,
            [req.body.id]
        );
        connection.release();
        return res.status(200).json({
            status: RESPONSE_STATUS.SUCCESS,
            msg: "successed retrieve client info",
            data: result[0],
        });
    } catch (err) {
        return res.status(403).json({
            status: RESPONSE_STATUS.FAILED,
            msg: "acquire client info failed",
            data: "",
        });
    }
};

export const clientSingleInstert = async (req: Request, res: Response) => {
    console.log("-> server - client: add new: ", req.body);
    try {
        const connection = await pool.getConnection();
        const checkPhone: any = await connection.query(
            `SELECT phone FROM ${DB_TABLE_LIST.CLIENTS} WHERE phone = ?`,
            [req.body.phone]
        );
        const checkEmail: any = await connection.query(
            `SELECT email FROM ${DB_TABLE_LIST.CLIENTS} WHERE email = ?`,
            [req.body.email]
        );
        if (!checkPhone[0].length && !checkEmail[0].length) {
            const newClient = await formatNewClient(req.body);
            const insertRes: any = await connection.query(
                `INSERT INTO ${DB_TABLE_LIST.CLIENTS} (first_name, last_name, phone, email, address, city, state, country, postcode) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                newClient
            );
            //console.log("-> insert new client: ", insertRes[0]);
            logger.infoLog("client: successed in register a new client");
            connection.release();
            res.status(201).json({
                status: RESPONSE_STATUS.SUCCESS,
                msg: "new client created successfully",
                data: "",
            });
        } else {
            let a = checkPhone[0][0] && "phone" in checkPhone[0][0];
            let b = checkEmail[0][0] && "email" in checkEmail[0][0];
            let temp =
                a && !b
                    ? RESPONSE_STATUS.FAILED_DUP_PHONE
                    : !a && b
                    ? RESPONSE_STATUS.FAILED_DUP_EMAIL
                    : RESPONSE_STATUS.FAILED_DUP_P_E;
            connection.release();
            //res.status(406).json({
            res.status(200).json({
                status: temp, // 401-phone existed, 402-email existed, 403-both existed
                msg: "conflict: accouont or phone or email",
                data: "",
            });
        }
    } catch (error) {
        console.log("-> insert single client error: ", error);
        return res.status(403).json({
            status: RESPONSE_STATUS.FAILED,
            msg: "add new client failed",
            data: "",
        });
    }
};

export const clientSingleDel = async (req: Request, res: Response) => {
    // Delete client
    console.log("-> server - client: delete clientID: ", req.body.id);
    try {
        const connection = await pool.getConnection();
        await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.CLIENTS} WHERE client_id = ?`,
            [req.body.id]
        );
        // Return success
        return res.status(200).json({
            status: RESPONSE_STATUS.SUC_DEL_SINGLE, // delete success
            msg: `Successed: delete client[id: ${req.body.id}]`,
            data: "",
        });
    } catch (err) {
        // Return fail
        return res.status(403).json({
            status: RESPONSE_STATUS.FAILED_DEL,
            msg: `Failed: delete client[id: ${req.body.id}]`,
            data: "",
        });
    }
};

export const clientSingleArchive = async (req: Request, res: Response) => {
    console.log("-> server - client: archive");
    try {
        const connection = await pool.getConnection();
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.CLIENTS} SET archive = ? WHERE client_id = ?`,
            [req.body.flag, req.body.id]
        );
        return res.status(200).json({
            status: 200,
            msg: `Successed: delete client[id: ${req.body.id}]`,
            data: "",
        });
    } catch (err) {
        console.log("-> archive error: ", err);
        return res.status(403).json({
            status: RESPONSE_STATUS.FAILED,
            msg: `Failed: archive client[id: ${req.body.id}]`,
            data: "",
        });
    }
};

// for update client in mysql clients table
export const clientSingleUpdate = async (req: Request, res: Response) => {
    console.log("-> server -client: update");
    try {
        const connection = await pool.getConnection();
        const checkPhone: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.CLIENTS} WHERE phone = ? AND client_id != ?`,
            [req.body.phone, req.body.id]
        );
        const checkEmail: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.CLIENTS} WHERE email = ? AND client_id != ?`,
            [req.body.email, req.body.id]
        );
        // if the length of the result of checkPhone is 0, then the phone is not duplicated
        const isPhoneDuplicated = checkPhone[0].length ? true : false;
        // if the length of the result of checkEmail is 0, then the email is not duplicated
        const isEmailDuplicated = checkEmail[0].length ? true : false;
        //
        if (!isPhoneDuplicated && !isPhoneDuplicated) {
            console.log("-> update not duplicated");
            const updateData = await formatNewClient(req.body);
            await connection.query(
                `
                UPDATE ${DB_TABLE_LIST.CLIENTS} 
                    SET 
                        first_name = ?, 
                        last_name = ?, 
                        phone = ?, 
                        email = ?, 
                        address = ?, 
                        city = ?, 
                        state = ?, 
                        country = ?, 
                        postcode = ?
                    WHERE client_id = ?
                `,
                [...updateData, req.body.id]
            );
            connection.release();
            return res.status(200).json({
                status: RESPONSE_STATUS.SUCCESS,
                msg: `Successed: update client[id: ${req.body.id}]`,
                data: "",
            });
        } else {
            let temp =
                isPhoneDuplicated && !isEmailDuplicated
                    ? RESPONSE_STATUS.FAILED_DUP_PHONE
                    : !isPhoneDuplicated && isEmailDuplicated
                    ? RESPONSE_STATUS.FAILED_DUP_EMAIL
                    : RESPONSE_STATUS.FAILED_DUP_P_E;
            console.log("-> update duplicated: ", temp);
            connection.release();
            //res.status(406).json({
            res.status(200).json({
                status: temp, // 401-phone existed, 402-email existed, 403-both existed
                msg: "Duplicated: phone or email",
                data: "",
            });
        }
    } catch (err) {
        console.log("-> archive error: ", err);
        return res.status(403).json({
            status: RESPONSE_STATUS.FAILED,
            msg: `Failed: update client[id: ${req.body.id}]`,
            data: "",
        });
    }
};
