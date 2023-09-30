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

const clientMulInstert = async (req: Request, res: Response) => {
    console.log("server - client: multiple insert clients ");
    try {
        const connection = await pool.getConnection();
        const insertData = phaseClientsData(req.body);
        //console.log("-> parsed data: ", insertData);

        const sql = `INSERT INTO ${DB_TABLE_LIST.CLIENT} (first_name, last_name, phone, email, address, city, state, country, postcode) VALUES ?`;
        await connection.query(sql, [insertData]);
        connection.release();
        res.status(200).json({
            status: 200,
            msg: "success: insert multiple clients",
            data: "",
        });
    } catch (error: any) {
        logger.errLog(error);
        if (error?.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                status: 400,
                msg: "Duplicate phone number. Data not inserted.",
                data: null,
            });
        }
        return res.status(400).json({
            status: 400,
            msg: "Failed: insert multiple clients",
            data: null,
        });
    }
};

const clientGetAll = async (req: Request, res: Response) => {
    console.log("-> server - client: all");
    try {
        const connection = await pool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.VIEW_CLIENTS}`
        );
        //console.log("-> ALL client from server: ", result);
        connection.release();
        return res.status(200).json({
            status: 200,
            msg: "successed retrieve all client",
            data: result[0],
        });
    } catch (error) {
        return res.status(403).json({
            status: 400,
            msg: "acquire all client failed",
            data: "",
        });
    }
};

const clientSingleInstert = async (req: Request, res: Response) => {
    console.log("-> server - client: add new: ", req.body);
    try {
        const connection = await pool.getConnection();
        const checkPhone: any = await connection.query(
            `SELECT phone FROM ${DB_TABLE_LIST.CLIENT} WHERE phone = ?`,
            [req.body.phone]
        );
        const checkEmail: any = await connection.query(
            `SELECT email FROM ${DB_TABLE_LIST.CLIENT} WHERE email = ?`,
            [req.body.email]
        );
        if (!checkPhone[0].length && !checkEmail[0].length) {
            const newClient = await formatNewClient(req.body);
            const insertRes: any = await connection.query(
                `INSERT INTO ${DB_TABLE_LIST.CLIENT} (first_name, last_name, phone, email, address, city, state, country, postcode) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                newClient
            );
            //console.log("-> insert new client: ", insertRes[0]);
            logger.infoLog("client: successed in register a new client");
            connection.release();
            res.status(201).json({
                status: 200,
                msg: "new client created successfully",
                data: "",
            });
        } else {
            let a = checkPhone[0][0] && "phone" in checkPhone[0][0];
            let b = checkEmail[0][0] && "email" in checkEmail[0][0];
            let temp = a && !b ? 401 : !a && b ? 402 : 403;
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
            status: 400,
            msg: "add new client failed",
            data: "",
        });
    }
};

export { clientMulInstert, clientGetAll, clientSingleInstert };
