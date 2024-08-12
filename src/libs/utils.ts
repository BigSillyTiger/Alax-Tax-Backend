import bcrypt from "bcrypt";
import type { Tservice, TstaffWPayslip } from "../utils/global";

export const encodePW = async (password: string) => {
    const newPW = await bcrypt.hash(password, 10);
    return newPW;
};

export const replaceStaffPW = (data: TstaffWPayslip[], pw: string) => {
    return data.map((item) => {
        const newItem = { ...item, password: pw };
        return newItem;
    });
};

/**
 * @description find the number of all null osid of service
 * @param data
 */
export const findEmptyOsid = (data: Tservice[]) => {
    return data.filter((item) => item.osid === null || item.osid === "");
};
