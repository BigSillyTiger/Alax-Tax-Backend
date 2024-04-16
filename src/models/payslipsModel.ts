import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { DB_TABLE_LIST } from "../utils/config";
import adminPool from "./adminPool";

export const m_psSingleInsert = async (
    payslip: any,
    bonus: any,
    psid: string,
    uid: string,
    s_date: string,
    e_date: string
) => {
    try {
        console.log(`-> uid[${uid}] s_date[${s_date}] e_date[${e_date}]`);
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");
        if (bonus?.length) {
            await connection.query(
                `
                INSERT INTO ${DB_TABLE_LIST.BONUS} (fk_psid, fk_uid, note, amount) VALUES ?;
            `,
                [bonus]
            );
        }
        await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.PAYSLIP} (psid, fk_uid, status, hr, s_date, e_date, paid) VALUES ?;`,
            [payslip]
        );
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.WORK_LOG} 
            SET 
                wl_status = "unpaid",
                fk_psid = '${psid}'
            WHERE wl_date BETWEEN '${s_date}' AND '${e_date}'
            AND fk_uid = '${uid}'
            AND wl_status = "confirmed";`
        );
        await connection.query("COMMIT;");
        connection.release();
        return true;
    } catch (error) {
        console.log("-> error: payslip single insert - ", error);
        return false;
    }
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

export const m_psSingleDel = async (psid: string) => {
    try {
        console.log("-> delete psid: ", psid);
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");
        // delete related bonus
        await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.BONUS} WHERE fk_psid = '${psid}';`
        );
        // delete payslip
        await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.PAYSLIP} WHERE psid = '${psid}';`
        );
        // reset fk_psid in work_log table
        // reset wl_status to 'confirmed' in work_log table
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.WORK_LOG} SET fk_psid = NULL, wl_status = 'confirmed' WHERE fk_psid = '${psid}';`
        );
        await connection.query("COMMIT;");
        connection.release();
        return true;
    } catch (error) {
        console.log("-> error: payslip single del - ", error);
        return false;
    }
};
