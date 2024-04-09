import type { Request, Response } from "express";
import { RES_STATUS, uidPrefix } from "../../utils/config";
import logger from "../../libs/logger";
import { encodePW } from "../../libs/utils";
import { genPSID, genUID } from "../../libs/id";
import { m_psSingleInsert } from "../../models/payslipsModel";
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
        const psData = formatPayslip(psid, req.body);
        const bonusData = formatBonus(psid, req.body.fk_uid, req.body.bonus);
        /* const deductionData = formatDeduction(
            psid,
            req.body.fk_uid,
            req.body.deduction
        ); */
        //const result = await m_psSingleInsert(psData, bonusData, deductionData);
    } catch (error) {
        console.log("-> error: payslip: SingleInsert: ", error);
        return res.status(500).json({
            status: RES_STATUS.FAILED,
            msg: "Failed to insert payslip",
            data: false,
        });
    }
};
