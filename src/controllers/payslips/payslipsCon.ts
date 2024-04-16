import type { Request, Response } from "express";
import { RES_STATUS, uidPrefix } from "../../utils/config";
import logger from "../../libs/logger";
import { encodePW } from "../../libs/utils";
import { genPSID, genUID } from "../../libs/id";
import {
    m_psBonusAll,
    m_psSingleDel,
    m_psSingleInsert,
    m_psStatusUpdate,
} from "../../models/payslipsModel";
import { formatBonus, formatDeduction, formatPayslip } from "../../libs/format";

export const psSingleInsert = async (req: Request, res: Response) => {
    console.log("-> server - payslip: SingleInsert: ", req.body);
    try {
        /**
        1. generate new psid
        2. insert new payslip
        3. update psid into work_logs table with wlid[]
        4. insert bonus
        5. insert deduction
         */
        const psid = await genPSID();
        if (!psid) throw new Error("Failed to generate new psid");
        const psData = formatPayslip(psid, req.body.payslip);
        const bonusData = formatBonus(
            psid,
            req.body.payslip.fk_uid,
            req.body.bonus
        );
        console.log("-> new psData: ", psData);
        console.log("-> new bonusData: ", bonusData);
        const result = await m_psSingleInsert(
            [psData],
            bonusData,
            psid,
            req.body.payslip.fk_uid,
            req.body.payslip.s_date,
            req.body.payslip.e_date
        );
        if (!result) throw new Error("Failed to insert payslip");
        return res.status(200).json({
            status: RES_STATUS.SUC_INSERT_PAYSLIP,
            msg: "Success - Payslip inserted",
            data: true,
        });
    } catch (error) {
        console.log("-> error: payslip: SingleInsert: ", error);
        return res.status(500).json({
            status: RES_STATUS.FAILED_INSERT_PAYSLIP,
            msg: "Failed to insert payslip",
            data: false,
        });
    }
};

/**
 * @description Delete payslip and update work_logs table
 *              - work_logs table: wl_status = "confirmed", fk_psid = null
 * @param req
 * @param res
 * @returns
 */
export const psSingleDel = async (req: Request, res: Response) => {
    console.log("-> server - payslip: SingleDel: ", req.body);
    try {
        /**
        1. delete payslip
        2. delete bonus
        3. update work_logs table: wl_status = "confirmed", fk_psid = null
         */
        const psid = req.body.psid;
        const result = await m_psSingleDel(psid);
        if (!result) throw new Error("Failed to delete payslip");
        return res.status(200).json({
            status: RES_STATUS.SUC_DEL_PAYSLIP,
            msg: "Success - Payslip deleted",
            data: true,
        });
    } catch (error) {
        console.log("-> error: payslip: SingleDel: ", error);
        return res.status(500).json({
            status: RES_STATUS.FAILED_DEL_PAYSLIP,
            msg: "Failed to delete payslip",
            data: false,
        });
    }
};

/**
 * @description Update payslip status and update work_logs table
 *              - work_logs table:
 *                  - payslip status = "pending": wl_status = "unpaid"
 *                  - payslip status = "completed": wl_status = "completed"
 * @returns
 */
export const psStatusUpdate = async (req: Request, res: Response) => {
    console.log("-> server - payslip: StatusUpdate: ", req.body);
    try {
        const psid = req.body.psid;
        const ps_status = req.body.status; // payslip status
        const wl_status = ps_status === "pending" ? "unpaid" : "completed";
        const result = await m_psStatusUpdate(psid, ps_status, wl_status);
        if (!result) throw new Error("Failed to update payslip status");
        return res.status(200).json({
            status: RES_STATUS.SUC_UPDATE_PAYSLIP,
            msg: "Success - Payslip status updated",
            data: true,
        });
    } catch (error) {
        console.log("-> error: payslip: StatusUpdate: ", error);
        return res.status(500).json({
            status: RES_STATUS.FAILED_UPDATE_PAYSLIP,
            msg: "Failed to update payslip status",
            data: false,
        });
    }
};

export const psBonusAll = async (req: Request, res: Response) => {
    console.log("-> server - payslip: BonusAll: ", req.body);
    try {
        const result = await m_psBonusAll();
        if (!result) throw new Error("Failed to get bonus data");
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "Success - Bonus data retrieved",
            data: result,
        });
    } catch (error) {
        console.log("-> error: payslip: BonusAll: ", error);
        return res.status(500).json({
            status: RES_STATUS.FAILED,
            msg: "Failed to get bonus data",
            data: null,
        });
    }
};
