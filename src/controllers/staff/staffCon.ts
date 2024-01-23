import type { Request, Response } from "express";
import { RES_STATUS } from "../../utils/config";
import logger from "../../utils/logger";
import {
    m_staffGetAll,
    m_staffGetSingle,
    m_staffInsert,
    m_staffArchiveSingle,
    m_staffDelSingle,
    m_staffUpdateProperty,
    m_staffUpdate,
    m_staffIsPropertyExist,
} from "../../models/staffCtl";

const phaseStaffData = (items: any /* placeholder */) => {
    return items.map((item: any) => {
        const { first_name, last_name, phone, email, password, address, role } =
            item;
        return [first_name, last_name, phone, email, password, address, role];
    });
};

/**
 * @description retrieve list of all staff with info
 * @param req
 * @param res
 * @returns
 */
export const staffAllInfo = async (req: Request, res: Response) => {
    logger.infoLog("server - staff: get all staff info");
    const result = await m_staffGetAll();
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "success: get all staff info",
            data: result,
        });
    }
    return res.status(500).json({
        status: RES_STATUS.FAILED,
        msg: "fail: get all staff info",
        data: null,
    });
};

/**
 * @description retrieve single staff info
 * @param req
 * @param res
 * @returns
 */
export const staffSingleInfo = async (req: Request, res: Response) => {
    logger.infoLog("server - staff: get single staff info");
    const result = await m_staffGetSingle(req.body.uid);
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "success: get single staff info",
            data: result,
        });
    }
    return res.status(500).json({
        status: RES_STATUS.FAILED,
        msg: "fail: get single staff info",
        data: null,
    });
};

/**
 * @description insert a new staff info, check if phone or email is duplicated before insert
 * @param req
 * @param res
 * @returns
 */
// this function is similar to clientSingleInsert
export const staffSingleInstert = async (req: Request, res: Response) => {
    console.log("-> server - staff: single insert: ", req.body[0]);

    const phoneDup = await m_staffIsPropertyExist(
        0, // new client does not nedd to check client_id
        "phone",
        req.body[0].phone
    );
    const emailDup = await m_staffIsPropertyExist(
        0, // new client does not nedd to check client_id
        "email",
        req.body[0].email
    );
    //console.log(`-> phoneDup: ${phoneDup}, emailDup: ${emailDup}`);

    if (!emailDup && !phoneDup) {
        const newStaff = phaseStaffData(req.body);
        console.log("-> newClient insertData: ", newStaff);
        const result = await m_staffInsert(newStaff);

        if (result.insertId > 0) {
            logger.infoLog("staff: successed in register a new staff");
            return res.status(201).json({
                status: RES_STATUS.SUCCESS,
                msg: "new staff created successfully",
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
export const staffSingleArchive = async (req: Request, res: Response) => {
    logger.infoLog("server - staff: archive single staff");
    const result = await m_staffArchiveSingle(req.body.uid);
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "success: archive single staff",
            data: result,
        });
    }
    return res.status(500).json({
        status: RES_STATUS.FAILED,
        msg: "fail: archive single staff",
        data: null,
    });
};

/**
 * @description delete a staff
 * @param req
 * @param res
 * @returns
 */
export const staffSingleDel = async (req: Request, res: Response) => {
    logger.infoLog("server - staff: delete single staff");
    const result = await m_staffDelSingle(req.body.uid);
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "success: delete single staff",
            data: result,
        });
    }
    return res.status(500).json({
        status: RES_STATUS.FAILED,
        msg: "fail: delete single staff",
        data: null,
    });
};

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const staffSingleUpdate = async (req: Request, res: Response) => {
    logger.infoLog("server - staff: update single staff");
    console.log(123);
    const result = await m_staffUpdate(req.body);
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "success: update single staff",
            data: result,
        });
    }
    return res.status(500).json({
        status: RES_STATUS.FAILED,
        msg: "fail: update single staff",
        data: null,
    });
};
