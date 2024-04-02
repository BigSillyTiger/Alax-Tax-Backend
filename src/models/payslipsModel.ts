import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { DB_TABLE_LIST } from "../utils/config";
import adminPool from "./adminPool";

export const m_psSingleInsert = async (psid: string) => {
    try {
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");
        await connection.query(``);
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
