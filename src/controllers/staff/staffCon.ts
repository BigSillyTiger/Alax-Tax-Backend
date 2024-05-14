import type { Request, Response } from "express";
import { RES_STATUS, uidPrefix } from "../../utils/config";
import logger from "../../libs/logger";
import {
    m_staffGetAll,
    m_staffGetSingle,
    m_staffInsert,
    m_staffArchiveSingle,
    m_staffDelSingle,
    m_staffUpdateProperty,
    m_staffUpdate,
    m_staffIsPropertyExist,
    m_staffGetWUID,
} from "../../models/staffModel";
import { encodePW, replaceStaffPW } from "../../libs/utils";
import { genUID } from "../../libs/id";
import { formatStaff } from "../../libs/format";
import { TRequestWithUser, TstaffWPayslip } from "../../utils/global";

/**
 * @description retrieve list of all staff with info
 * @param req
 * @param res
 * @returns
 */
export const staffAllInfo = async (req: TRequestWithUser, res: Response) => {
    logger.infoLog("server - staff: get all staff info");
    try {
        const uid = req.user?.userId as string;
        const admin = req.user?.userId.charAt(0); // M - manager, E - employee
        let result;
        if (admin === uidPrefix.manager) {
            result = (await m_staffGetAll()) as TstaffWPayslip[];
        } else {
            result = (await m_staffGetWUID(uid)) as TstaffWPayslip[];
        }

        if (result?.length) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: "success: get all staff info",
                data: replaceStaffPW(result, ""),
            });
        } else {
            throw new Error("error: get all staff info");
        }
    } catch (error) {
        return res.status(500).json({
            status: RES_STATUS.FAILED,
            msg: "fail: get all staff info",
            data: null,
        });
    }
};

/**
 * @description retrieve single staff info
 * @param req
 * @param res
 * @returns
 */
export const staffSingleInfo = async (req: Request, res: Response) => {
    logger.infoLog("server - staff: get single staff info");
    try {
        const result = await m_staffGetSingle(req.body.uid);
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: "success: get single staff info",
                data: { ...result, password: "" },
            });
        }
        throw new Error("error: get single staff info");
    } catch (error) {
        return res.status(500).json({
            status: RES_STATUS.FAILED,
            msg: "fail: get single staff info",
            data: null,
        });
    }
};

/**
 * @description insert a new staff info, check if phone or email is duplicated before insert
 * @param req
 * @param res
 * @returns
 */
// this function is similar to clientSingleInsert
export const staffSingleInstert = async (req: Request, res: Response) => {
    console.log("-> server - staff: single insert: ", req.body);

    const phoneDup = await m_staffIsPropertyExist(
        "0", // new client does not nedd to check cid
        "phone",
        req.body.staff[0].phone
    );
    const emailDup = await m_staffIsPropertyExist(
        "0", // new client does not nedd to check cid
        "email",
        req.body.staff[0].email
    );
    //console.log(`-> phoneDup: ${phoneDup}, emailDup: ${emailDup}`);

    if (!emailDup && !phoneDup) {
        const newPW = await encodePW(req.body.staff[0].password);
        const newUid = await genUID(
            uidPrefix[
                req.body.staff[0].role as "employee" | "manager" | "labor"
            ]
        );
        req.body.staff[0].access = req.body.staff[0].role === "labor" ? 0 : 1;
        const result = await m_staffInsert(
            formatStaff(newUid, newPW, req.body.staff[0])
        );

        if (result.affectedRows > 0) {
            logger.infoLog("staff: successed in register a new staff");
            return res.status(201).json({
                status: RES_STATUS.SUCCESS,
                msg: "new staff created successfully",
                data: result,
            });
        } else {
            return res.status(403).json({
                status: RES_STATUS.FAILED,
                msg: "new staff created failed",
                data: result,
            });
        }
    } else {
        let temp =
            phoneDup && !emailDup
                ? RES_STATUS.FAILED_DUP_PHONE
                : !phoneDup && emailDup
                ? RES_STATUS.FAILED_DUP_EMAIL
                : RES_STATUS.FAILED_DUP_P_E;
        console.log("-> staff insert duplicated: ", temp);

        return res.status(200).json({
            status: temp, // 401-phone existed, 402-email existed, 403-both existed
            msg: "error: account or phone or email conflict, or error occurs",
            data: "",
        });
    }
};

/**
 * @description archieve a staff
 * @param req
 * @param res
 * @returns
 */
export const staffSingleDel = async (req: Request, res: Response) => {
    logger.infoLog("server - staff: archive single staff");
    try {
        if (req.body.uid === "M001" || req.body.uid === "M002") {
            return res.status(200).json({
                status: RES_STATUS.FAILED,
                msg: "fail: can not delete manager account",
                data: null,
            });
        }
        const result = await m_staffArchiveSingle(req.body.uid);

        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: "success: archive single staff",
                data: result,
            });
        } else {
            throw new Error("error: archive single staff");
        }
    } catch (error) {
        console.log("err: archive single staff: ", error);
        return res.status(405).json({
            status: RES_STATUS.FAILED_DEL,
            msg: "fail: archive single staff",
            data: null,
        });
    }
};

/**
 * @description delete a staff
 * @param req
 * @param res
 * @returns
 */
export const staffSingleDel_back = async (req: Request, res: Response) => {
    logger.infoLog("server - staff: delete single staff");
    const result = await m_staffDelSingle(req.body.uid);
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUC_DEL,
            msg: `success: delete single staff[id: ${req.body.uid}]`,
            data: result,
        });
    }
    return res.status(500).json({
        status: RES_STATUS.FAILED_DEL,
        msg: `fail: delete single staff[id: ${req.body.uid}]`,
        data: null,
    });
};

/**
 * @description update staff personal info without password
 * @param req
 * @param res
 * @returns
 */
export const staffSingleUpdate = async (req: Request, res: Response) => {
    console.log("server - staff: update single staff ");
    try {
        // check if phone or email is duplicated
        const phoneDup = await m_staffIsPropertyExist(
            req.body.staff.uid,
            "phone",
            req.body.staff.phone
        );
        const emailDup = await m_staffIsPropertyExist(
            req.body.staff.uid,
            "email",
            req.body.staff.email
        );
        if (phoneDup || emailDup) {
            let temp =
                phoneDup && !emailDup
                    ? RES_STATUS.FAILED_DUP_PHONE
                    : !phoneDup && emailDup
                    ? RES_STATUS.FAILED_DUP_EMAIL
                    : RES_STATUS.FAILED_DUP_P_E;

            return res.status(200).json({
                status: temp, // 401-phone existed, 402-email existed, 403-both existed
                msg: "error: account or phone or email conflict, or error occurs",
                data: "",
            });
        }

        // can not change root managers' access
        if (req.body.staff.uid === "M001" || req.body.staff.uid === "M002") {
            req.body.staff.access = 1;
        } else if (req.body.staff.role === "labor") {
            req.body.staff.access = 0;
        }

        // need to generate new uid if role changed
        let result;
        if (
            req.body.staff.role !== req.body.currentRole &&
            // can not change root managers' uid
            req.body.uid !== "M001" &&
            req.body.uid !== "M002"
        ) {
            const newUid = await genUID(
                uidPrefix[
                    req.body.staff.role as "employee" | "manager" | "labor"
                ]
            );
            result = await m_staffUpdate(req.body.staff, newUid);
        } else {
            // no need to change uid
            result = await m_staffUpdate(req.body.staff);
        }

        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: "success: update single staff",
                data: result,
            });
        } else {
            throw new Error("error: update single staff");
        }
    } catch (error) {
        return res.status(500).json({
            status: RES_STATUS.FAILED,
            msg: "fail: update single staff",
            data: null,
        });
    }
};

/**
 * @description update staff access
 * @param req
 * @param res
 * @returns
 */
export const staffUpdateAccess = async (req: Request, res: Response) => {
    console.log("-> server - staff: update access: ", req.body.accessody);
    try {
        const result = await m_staffUpdateProperty(
            req.body.uid,
            "access",
            req.body.access
        );
        console.log("---> update staff access: ", result);
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: "success: update staff access",
                data: result,
            });
        } else {
            throw new Error("error: update staff access");
        }
    } catch (error) {
        return res.status(500).json({
            status: RES_STATUS.FAILED,
            msg: "fail: update staff access",
            data: null,
        });
    }
};

/**
 * @description update staff password
 * @param req
 * @param res
 * @returns
 */
export const staffUpdatePW = async (req: Request, res: Response) => {
    logger.infoLog("server - staff: update password");
    const newPW = await encodePW(req.body.pw);
    const result = await m_staffUpdateProperty(req.body.uid, "password", newPW);
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "success: update staff password",
            data: result,
        });
    }
    return res.status(500).json({
        status: RES_STATUS.FAILED,
        msg: "fail: update staff password",
        data: null,
    });
};
