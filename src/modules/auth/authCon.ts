import uuid from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

const generateToken = (userID: number): string => {
    const payload = { userID };
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "30s",
    });
};

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
    email,
    phone,
    password,
}: userType) => {
    const hashedPW = await bcrypt.hash(password, 10);
    //const date = formDate();
    return [first_name, surname, email, phone, hashedPW];
};

const registerNewUser = async (req: Request, res: Response) => {
    logger.infoLog("server - register");
    try {
        const connection = await pool.getConnection();
        const results: any = await connection.query(
            `SELECT phone, email FROM ${DB_TABLE_LIST.MANAGER} WHERE phone = ? OR email = ?`,
            [req.body.phone, req.body.email]
        );
        //console.log("-> search result: ", results[0]);
        if (!results[0].length) {
            const newUser = await formatNewUser(req.body);
            const insertRes: any = await connection.query(
                `INSERT INTO ${DB_TABLE_LIST.MANAGER} (first_name, surname, email, phone, password) VALUES(?, ?, ?, ?, ?)
            `,
                newUser
            );
            await connection.query(
                `INSERT INTO ${DB_TABLE_LIST.ADMIN_LEVEL} (fk_uid, dashboard, clients, orders, employees, management) VALUES(?,?,?,?,?,?)`,
                [
                    insertRes[0].insertId,
                    req.body.dashboard,
                    req.body.clients,
                    req.body.orders,
                    req.body.employees,
                    req.body.management,
                ]
            );
            console.log("-> the new instered user: ", insertRes[0].insertId);
            const userID = "";
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

const adminLogin = async (req: Request, res: Response) => {
    logger.infoLog("server - login: ");
    try {
        const connection = await pool.getConnection();
        const [user]: any = await connection.query(
            `SELECT * FROM managers WHERE email = ?`,
            [req.body.email]
        );
        if (!user.length) {
            connection.release();
            return res.status(404).json({ msg: "ERROR: wrong credentials" });
        } else {
            const pwMatch = await bcrypt.compare(
                req.body.password,
                user[0].password
            );
            if (!pwMatch) {
                connection.release();
                logger.warnLog(`error: loggin pw wrong`);
                return res
                    .status(404)
                    .json({ msg: "ERROR: wrong credentials" });
            }
            const token = generateToken(user[0].uid);
            logger.infoLog(`-> new login token: ${token}`);

            res.cookie("token", token, {
                maxAge: 1000 * 30,
                httpOnly: true,
            }).json({
                msg: "login success~~",
            });
        }
    } catch (err) {
        logger.errLog(err);
        res.status(500).json({ msg: "Internet Server Error" });
    }
};

const authCheck = async (req: Request, res: Response) => {
    logger.infoLog("Server - permission check");
    try {
        const connection = await pool.getConnection();
        const [user]: any = await connection.query(``);
    } catch (err) {}
    res.status(200).json({
        status: true,
        msg: "welcome to the protected page",
    });
};

const adminLogout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ msg: "successfully logout" });
    } catch (error) {
        res.status(400).json({ error: "logout error" });
    }
};

const permission = async (req: Request, res: Response) => {
    try {
        const connection = await pool.getConnection();
        const [user]: any = await connection.query(
            `SELECT * FROM managers WHERE email = ?`,
            [req.body.email]
        );
        res.status(200).json({ msg: "successfully logout" });
    } catch (error) {
        res.status(400).json({ error: "logout error" });
    }
};

export { registerNewUser, adminLogin, authCheck, adminLogout, permission };
