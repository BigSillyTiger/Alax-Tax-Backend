import uuid from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql, { Connection, createConnection } from "mysql2/promise";
import logger from "../../utils/logger";
import { DB_TABLE_LIST, sleep, RES_STATUS } from "../../utils/config";
import { Request, Response } from "express";
import {
    m_addManager,
    m_insertLevel,
    m_levelCheck,
    m_searchMPhoneEmail,
    m_searchMbyEmail,
} from "../../models/managerCtl";
import dotenv from "dotenv";

dotenv.config();

type TUser = {
    first_name: string;
    last_name: string;
    account: string;
    password: string;
    phone: string;
    email: string;
};

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DATABASE,
    connectionLimit: 15,
});

const generateToken = (userID: number): string => {
    const payload = { userID };
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const encodePW = async (password: string) => {
    const newPW = await bcrypt.hash(password, 10);
    return newPW;
};

export const registerNewUser = async (req: Request, res: Response) => {
    logger.infoLog("server - register new manager");
    try {
        const connection = await pool.getConnection();
        const result = await m_searchMPhoneEmail(
            req.body.phone,
            req.body.email
        );
        if (!result) {
            const newPW = await encodePW(req.body.password);
            const insertRes = await m_addManager(
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                req.body.phone,
                newPW
            );

            await m_insertLevel({
                cid: insertRes,
                dashboard: req.body.dashboard,
                clients: req.body.clients,
                orders: req.body.orders,
                employees: req.body.employees,
                management: req.body.management,
            });
            console.log("-> the new instered user: ", insertRes);
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

export const adminLogin = async (req: Request, res: Response) => {
    console.log("server - login");

    const connection = await pool.getConnection();
    const manager = await m_searchMbyEmail(req.body.email);
    if (manager?.uid) {
        const pwMatch = await bcrypt.compare(
            req.body.password,
            manager.password
        );
        if (!pwMatch) {
            connection.release();
            logger.warnLog(`error: loggin pw wrong`);
            return res.status(404).json({ msg: "ERROR: wrong credentials" });
        }
        const token = generateToken(manager.uid as number);
        logger.infoLog(`-> new login token: ${token}`);
        const result = await m_levelCheck(manager.uid);
        connection.release();
        if (result) {
            return res
                .cookie("token", token, {
                    expires: new Date(
                        Date.now() + parseInt(process.env.JWT_EXPIRE as string)
                    ),
                    httpOnly: true,
                })
                .json({
                    status: RES_STATUS.SUCCESS,
                    msg: "login success~~",
                    data: result[0],
                });
        }
    }
    connection.release();
    return res.status(404).json({
        status: RES_STATUS.FAILED,
        msg: "ERROR: login error",
        data: null,
    });
};

type TRequestWithUser = Request & {
    user?: {
        userId: number;
        username: string;
    };
};

export const authCheck = async (req: TRequestWithUser, res: Response) => {
    const uid = req.user!.userId;
    logger.infoLog(`Server - authCheck, userID = ${uid}`);
    const result = await m_levelCheck(uid);
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "welcome to the protected page",
            data: result,
        });
    } else {
        return res.status(403).json({
            status: RES_STATUS.FAILED,
            msg: "authcheck error",
            data: null,
        });
    }
};

export const adminLogout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ msg: "successfully logout" });
    } catch (error) {
        res.status(400).json({ error: "logout error" });
    }
};

export const permission = async (req: Request, res: Response) => {
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

export const test = async (req: Request, res: Response) => {
    await sleep(1000);
    res.status(200).json({ msg: "test ok" });
};
