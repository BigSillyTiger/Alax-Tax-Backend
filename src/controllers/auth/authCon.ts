import uuid from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger";
import { sleep, RES_STATUS } from "../../utils/config";
import { Request, Response } from "express";
import {
    m_addStaff,
    m_levelCheck,
    m_searchMPhoneEmail,
    m_searchMbyEmail,
} from "../../models/settingCtl";
import dotenv from "dotenv";
import { encodePW } from "../../utils/utils";

dotenv.config();

const generateToken = (userID: number): string => {
    const payload = { userID };
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const registerNewUser = async (req: Request, res: Response) => {
    logger.infoLog("server - register new staff");
    console.log("-> backend receive new staff: ", req.body);
    const peResult = await m_searchMPhoneEmail(req.body.phone, req.body.email);
    if (!peResult) {
        const newPW = await encodePW(req.body.password);
        const insertMRes = await m_addStaff(
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            req.body.phone,
            newPW,
            req.body.role,
            req.body.address,
            req.body.suburb,
            req.body.city,
            req.body.state,
            req.body.country,
            req.body.postcode,
            req.body.dashboard,
            req.body.clients,
            req.body.orders,
            req.body.calendar,
            req.body.staff,
            req.body.setting
        );

        if (insertMRes) {
            return res.status(201).json({
                status: RES_STATUS.SUCCESS,
                msg: "new user register successfully",
                data: null,
            });
        }
    }
    return res.status(406).json({
        status: RES_STATUS.FAILED,
        msg: "conflict: accouont or phone or email",
        data: null,
    });
};

export const adminLogin = async (req: Request, res: Response) => {
    console.log("server - login");

    const manager = await m_searchMbyEmail(req.body.email);
    if (manager?.uid) {
        const pwMatch = await bcrypt.compare(
            req.body.password,
            manager.password
        );
        if (!pwMatch) {
            logger.warnLog(`error: loggin pw wrong`);
            return res.status(404).json({ msg: "ERROR: wrong credentials" });
        }
        const token = generateToken(manager.uid as number);
        logger.infoLog(`-> new login token: ${token}`);
        const level = await m_levelCheck(manager.uid);
        level;
        if (level) {
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
                    data: level,
                });
        }
    }
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
    const level = await m_levelCheck(uid);
    if (level) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "welcome to the protected page",
            data: level,
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

// not used
export const permission = async (req: Request, res: Response) => {};

export const test = async (req: Request, res: Response) => {
    await sleep(1000);
    res.status(200).json({ msg: "test ok" });
};
