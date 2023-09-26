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
        const { first_name, last_name, phone, email, address } = item;
        return [first_name, last_name, phone, email, address];
    });
};

const clientMulInstert = async (req: Request, res: Response) => {
    console.log("server - client: multiple insert clients ");
    try {
        const connection = await pool.getConnection();
        const insertData = phaseClientsData(req.body);
        //console.log("-> parsed data: ", insertData);

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
            `SELECT * FROM ${DB_TABLE_LIST.VIEW_CLIENTS}`
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

const clientSingleInstert = async (req: Request, res: Response) => {
    console.log("-> server - client: add new");
    try {
        const connection = await pool.getConnection();
        const results: any = await connection.query(
            `SELECT phone, email FROM ${DB_TABLE_LIST.CLIENT} WHERE phone = ? OR email = ?`,
            [req.body.phone, req.body.email]
        );
        if (!results[0].length) {
            const newClient = await formatNewClient(req.body);
            const insertRes: any = await connection.query(
                `INSERT INTO ${DB_TABLE_LIST.CLIENT} (first_name, last_name, phone, email, address, city, state, country, postcode) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                newClient
            );
            //console.log("-> insert new client: ", insertRes[0]);
            logger.infoLog("client: successed in register a new client");
            res.status(201).json({
                status: true,
                msg: "new client created successfully",
                errType: 0,
            });
        } else {
            console.log("-> fould existed phone or email: ", results[0]);
            res.status(406).json({
                status: false,
                msg: "conflict: accouont or phone or email",
                errType: 2,
            });
        }
    } catch (error) {
        console.log("-> insert single client error: ", error);
        return res.status(403).json({
            status: false,
            msg: "add new client failed",
            errType: 1,
        });
    }
};

export { clientMulInstert, clientGetAll, clientSingleInstert };
