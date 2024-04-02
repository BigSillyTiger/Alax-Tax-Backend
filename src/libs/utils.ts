import bcrypt from "bcrypt";
import { m_wlGetWLStatusWid } from "../models/workLogModel";
import type { TstaffData } from "../utils/global";

export const encodePW = async (password: string) => {
    const newPW = await bcrypt.hash(password, 10);
    return newPW;
};

export const replaceStaffPW = (data: TstaffData[], pw: string) => {
    return data.map((item) => {
        const newItem = { ...item, password: pw };
        return newItem;
    });
};

export const checkWLStatus = async (wlid: string) => {
    try {
        const result = await m_wlGetWLStatusWid(wlid);
        if (result && result.length) {
            return result[0].wl_status;
        } else {
            throw new Error("Work log not found");
        }
    } catch (error) {
        console.log("-> error: check work log status: ", error);
        return false;
    }
};
