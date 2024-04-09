import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { DB_TABLE_LIST } from "../utils/config";
import adminPool from "./adminPool";
import { Tbonus, Tdeduction, TnewPayslip, Tpayslip } from "@/utils/global";

export const m_psSingleInsert = async (
    payslip: any,
    bonus: any[],
    deduction: any[]
) => {
    try {
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");
        await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.PAYSLIP} (psid, fk_uid, period, pay_date, hours, rate, gross, tax, net, super, created_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            payslip
        );
        await connection.query("COMMIT;");
    } catch (error) {}
};

export const m_psLastPSID = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query<RowDataPacket[]>(
            `SELECT psid FROM ${DB_TABLE_LIST.PAYSLIP} ORDER BY psid DESC LIMIT 1;`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("-> error: retrieve last psid - ", error);
        return null;
    }
};

export const m_psLastBID = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query<RowDataPacket[]>(
            `SELECT bid FROM ${DB_TABLE_LIST.BONUS} ORDER BY bid DESC LIMIT 1;`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("-> error: retrieve last bid - ", error);
        return null;
    }
};


