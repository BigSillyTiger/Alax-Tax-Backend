import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../../libs/logger";
import { RES_STATUS } from "../../utils/config";
import { Request, Response } from "express";
import {
    m_addStaff,
    m_levelCheck,
    m_searchMPhoneEmail,
    m_searchMbyEmail,
} from "../../models/settingModel";
import dotenv from "dotenv";
import { encodePW } from "../../libs/utils";
import { TRequestWithUser } from "../../utils/global";

dotenv.config();

const generateToken = (userID: string): string => {
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
            req.body.setting,
            req.body.hr,
            req.body.bsb,
            req.body.account
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
        const token = generateToken(manager.uid as string);
        logger.infoLog(`-> new login token: ${token}`);
        const level = await m_levelCheck(manager.uid as string);
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
    return res.status(403).json({
        status: RES_STATUS.FAILED,
        msg: "ERROR: login error",
        data: null,
    });
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

/**
 * @description check if user has access to the page
 * @param req
 * @param res
 * @returns
 */
export const accessCheck = async (req: TRequestWithUser, res: Response) => {
    console.log("-> server - access check: ", req.body);
    const uid = req.user!.userId;
    const access = await m_levelCheck(uid);
    if (access[req.body.page] !== 0) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "access check success",
            data: access,
        });
    } else {
        return res.status(500).json({
            status: RES_STATUS.FAILED,
            msg: "access check error",
            data: false,
        });
    }
};
