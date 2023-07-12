import uuid from "uuid";
import bcrypt from "bcrypt";
import mysql, { Connection, createConnection } from "mysql2/promise";
import logger from "../../utils/logger";
import { DB_TABLE_LIST } from "../../utils/config";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

interface userType {
    first_name: string;
    surname: string;
    account: string;
    password: string;
    phone: string;
    email: string;
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DATABASE,
    connectionLimit: 5,
});

const formDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding leading zero if needed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatNewUser = async ({
    first_name,
    surname,
    account,
    password,
    phone,
    email,
}: userType) => {
    const hashedPW = await bcrypt.hash(password, 10);
    const date = formDate();
    return [first_name, surname, account, hashedPW, phone, email, date];
};

const registerNewUser = async (req: Request, res: Response) => {
    logger.infoLog("server - register");
    try {
        const connection = await pool.getConnection();
        const results: any = await connection.query(
            `SELECT account, phone, email FROM ${DB_TABLE_LIST.MANAGER} WHERE account = ? OR phone = ? OR email = ?`,
            [req.body.account, req.body.phone, req.body.email]
        );
        if (!results.length) {
            const newUser = await formatNewUser(req.body);
            await connection.query(
                `INSERT INTO ${DB_TABLE_LIST.MANAGER} (first_name, surname, account, password, phone, email, created_date) VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
                newUser
            );
            res.status(201).json({ msg: "new user register successfully" });
        } else {
            res.status(406).json({
                msg: "conflict: accouont or phone or email",
            });
        }
        connection.release();
    } catch (err) {
        logger.errLog(err);
        res.status(500).json({ msg: "Internet Server Error" });
    }
};

export { registerNewUser };
