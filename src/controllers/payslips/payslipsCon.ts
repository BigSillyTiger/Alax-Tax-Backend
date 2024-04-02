import type { Request, Response } from "express";
import { RES_STATUS, uidPrefix } from "../../utils/config";
import logger from "../../libs/logger";
import { encodePW } from "../../libs/utils";
import { genPSID, genStaffUid } from "../../libs/id";
import { m_psSingleInsert } from "../../models/payslipsModel";

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
    } catch (error) {}
};
