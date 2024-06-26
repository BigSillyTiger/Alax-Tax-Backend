import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { DB_TABLE_LIST } from "../utils/config";
import adminPool from "../config/adminPool";

export const m_psAll = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.PAYSLIP};`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("-> error: payslip all - ", error);
        return false;
    }
};

export const m_psAllWUID = async (uid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.PAYSLIP} WHERE fk_uid = ?;`,
            [uid]
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("-> error: payslip all - ", error);
        return false;
    }
};

export const m_psSingleInsert = async (
    payslip: any,
    bonus: any,
    psid: string,
    uid: string,
    s_date: string,
    e_date: string
) => {
    try {
        //console.log(`-> uid[${uid}] s_date[${s_date}] e_date[${e_date}]`);
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
            `INSERT INTO ${DB_TABLE_LIST.PAYSLIP} (psid, fk_uid, status, hr, s_date, e_date, paid, company_name, company_addr, company_phone, staff_name, staff_phone, staff_email, staff_addr, staff_bsb, staff_acc) VALUES ?;`,
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

export const m_psStatusUpdate = async (
    psid: string,
    ps_status: string,
    wl_status: string
) => {
    try {
        console.log("-> update psid: ", psid);
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.PAYSLIP} SET status = '${ps_status}' WHERE psid = '${psid}';`
        );
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.WORK_LOG} SET wl_status = '${wl_status}' WHERE fk_psid = '${psid}';`
        );
        await connection.query("COMMIT;");
        connection.release();
        return true;
    } catch (error) {
        console.log("-> error: payslip status update - ", error);
        return false;
    }
};

export const m_psBonusAll = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.BONUS};`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("-> error: payslip bonus all - ", error);
        return false;
    }
};

export const m_psBonusAllWUID = async (uid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.BONUS} WHERE fk_uid = ?;`,
            [uid]
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("-> error: payslip bonus all - ", error);
        return false;
    }
};
