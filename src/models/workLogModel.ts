import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { DB_TABLE_LIST } from "../utils/config";
import adminPool from "./adminPool";

export const m_getLastWorkLog = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.WORK_LOGS} ORDER BY id DESC LIMIT 1`
        );
        connection.release();
        return rows;
    } catch (err) {
        console.log("err: get last work log: ", err);
        return null;
    }
};

/**
 * @description this sql has issues, need to fix
 * @description not used api
 * @returns
 */
export const m_wlGetAllOrdersWithWL = async () => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'oid', O.oid,
                    'fk_cid', O.fk_cid,
                    'address', O.address,
                    'suburb', O.suburb,
                    'city', O.city,
                    'state', O.state,
                    'country', O.country,
                    'postcode', O.postcode,
                    'status', O.status,
                    'deposit', O.deposit,
                    'gst', O.gst,
                    'total', O.total,
                    'paid', O.paid,
                    'created_date', O.created_date,
                    'invoice_date', O.invoice_date,
                    'order_services', all_services,
                    'payments', paymentData,
                    'client_info', clientInfo,
                    'work_logs', workLogs
                )
            )
            FROM ${DB_TABLE_LIST.ORDERS} O
            JOIN (
                SELECT
                    cid,
                    JSON_OBJECT(
                        'cid', c.cid,
                        'first_name', c.first_name,
                        'last_name', c.last_name,
                        'phone', c.phone,
                        'email', c.email,
                        'address', c.address,
                        'suburb', c.suburb,
                        'city', c.city,
                        'state', c.state,
                        'country', c.country,
                        'postcode', c.postcode
                    ) AS clientInfo
                FROM ${DB_TABLE_LIST.CLIENTS} c
            ) C ON O.fk_cid = C.cid
            JOIN (
                SELECT 
                    fk_oid,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'ranking', ranking,
                            'fk_oid', fk_oid,
                            'title', title,
                            'description', description,
                            'qty', qty,
                            'unit', unit,
                            'taxable', taxable,
                            'unit_price', unit_price,
                            'gst', gst,
                            'netto', netto
                        )
                    ) AS all_services
                FROM ${DB_TABLE_LIST.ORDER_SERVICES}
                GROUP BY fk_oid
            ) B ON O.oid = B.fk_oid
            LEFT JOIN (
                SELECT 
                    fk_oid,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'fk_oid', fk_oid,
                            'paid', paid,
                            'paid_date', paid_date
                        )
                    ) AS paymentData
                FROM ${DB_TABLE_LIST.PAYMENTS}
                GROUP BY fk_oid 
            ) P ON O.oid = P.fk_oid
            LEFT JOIN (
                SELECT
                    O.oid AS fk_oid,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'fk_oid', logs.fk_oid,
                            'wl_date', logs.wl_date,
                            'assigned_work', logs.logs_array
                        )
                    ) AS workLogs
                FROM ${DB_TABLE_LIST.ORDERS} O
                LEFT JOIN (
                    SELECT
                        wl.fk_oid,
                        wl.wl_date,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'wlid', wl.wlid,
                                'fk_uid', wl.fk_uid,
                                'fk_oid', wl.fk_oid,
                                'wl_date', wl.wl_date,
                                'e_time', wl.e_time,
                                's_time', wl.s_time,
                                'b_time', wl.b_time,
                                'b_hour', wl.b_hour,
                                'wl_note', wl.wl_note,
                                'wl_status', wl.wl_status,
                                'confirm_status', wl.confirm_status,
                                'archive', wl.archive,
                                'first_name', s.first_name,
                                'last_name', s.last_name,
                                'phone', s.phone,
                                'email', s.email,
                                'role', s.role
                            )
                        ) AS logs_array
                    FROM ${DB_TABLE_LIST.WORK_LOGS} wl
                    JOIN staff s ON wl.fk_uid = s.uid
                    WHERE wl.archive = 0
                    GROUP BY wl.fk_oid, wl.wl_date
                ) AS logs ON logs.fk_oid = O.oid
                GROUP BY O.oid
            ) W ON O.oid = W.fk_oid;
            `
        );
        connection.release();
        return Object.values(result[0][0])[0];
    } catch (err) {
        console.log("err: get all orders with work log: ", err);
        return null;
    }
};

export const m_wlGetALLWithLogStructure = async () => {
    try {
        const connection = await adminPool.getConnection();
        const res: any = await connection.query(`
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                    'assigned_work', logs,
                    'fk_oid', fk_oid,
                    'wl_date', wl_date
                )
            ) AS result
            FROM (
                SELECT 
                    fk_oid,
                    wl_date,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'wlid', wl.wlid,
                            'fk_uid', wl.fk_uid,
                            'fk_oid', wl.fk_oid,
                            'wl_date', wl.wl_date,
                            'e_time', wl.e_time,
                            's_time', wl.s_time,
                            'b_time', wl.b_time,
                            'b_hour', wl.b_hour,
                            'wl_note', wl.wl_note,
                            'wl_status', wl.wl_status,
                            'confirm_status', wl.confirm_status,
                            'archive', wl.archive,
                            'first_name', s.first_name,
                            'last_name', s.last_name,
                            'phone', s.phone,
                            'email', s.email,
                            'role', s.role
                        )
                    ) AS logs
                FROM ${DB_TABLE_LIST.WORK_LOGS} wl
                JOIN staff s ON wl.fk_uid = s.uid
                WHERE wl.archive = 0
                GROUP BY 
                    fk_oid, wl_date
            ) AS subquery
            ;`);
        connection.release();
        const [[{ result }]] = res;
        //const [rows] = res;
        //const [firstRow] = rows;
        //const { result } = firstRow;
        //console.log("---> wlGetALLWithLogStructure: ", result[0][0].result);
        //return res[0][0].result;
        return result;
    } catch (error) {
        console.log("err: wlGetALLWithLogStructure: ", error);
        return null;
    }
};

/**
 * @description delete previous work log with
 * @param oid
 */
export const m_wlDelWorkLog = async (oid: string) => {
    try {
    } catch (error) {}
};

export const m_wlUpdateAssignments = async (oid: string, data: any[]) => {
    try {
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");
        await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.WORK_LOGS} WHERE fk_oid = ?;`,
            [oid]
        );
        await connection.query(
            `
            INSERT INTO ${DB_TABLE_LIST.WORK_LOGS} (wlid, fk_oid, fk_uid, wl_date, s_time, e_time, b_time, b_hour, wl_status, wl_note, confirm_status, archive) VALUES ?;
        `,
            [data]
        );
        await connection.query("COMMIT;");
        console.log("-> finished transaction - update worklog");
        connection.release();
        return true;
    } catch (error) {
        console.log("-> failed transaction - update worklog");
        console.log("-> error occurs: ", error);
        return false;
    }
};

export const m_wlGetAllWLID = async (): Promise<RowDataPacket[] | null> => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `SELECT wlid FROM ${DB_TABLE_LIST.WORK_LOGS};`
        );
        connection.release();
        return rows as RowDataPacket[];
    } catch (error) {
        console.log("err: get all wlid: ", error);
        return null;
    }
};

export const m_wlGetAll = async (
    archive = 0
): Promise<RowDataPacket[] | null> => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `SELECT 
                wl.*,
                s.first_name, s.last_name, s.email, s.phone,
                o.address, o.suburb, o.city, o.state, o.country, o.postcode
            FROM ${DB_TABLE_LIST.WORK_LOGS} wl 
            INNER JOIN staff s ON wl.fk_uid = s.uid
            INNER JOIN orders o ON wl.fk_oid = o.oid
            WHERE wl.archive = ${archive};`
        );
        connection.release();
        //console.log("-> test rows: ", rows);
        return rows as RowDataPacket[];
    } catch (error) {
        console.log("err: get all work logs: ", error);
        return null;
    }
};

export const m_wlGetToday = async (
    today: string,
    archive = 0
): Promise<RowDataPacket[] | null> => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `SELECT 
                wl.*,
                s.first_name, s.last_name, s.email, s.phone,
                o.address, o.suburb, o.city, o.state, o.country, o.postcode
            FROM ${DB_TABLE_LIST.WORK_LOGS} wl 
            INNER JOIN staff s ON wl.fk_uid = s.uid
            INNER JOIN orders o ON wl.fk_oid = o.oid
            WHERE wl.wl_date = ? AND wl.archive = ?;`,
            [today, archive]
        );
        connection.release();
        return rows as RowDataPacket[];
    } catch (error) {
        console.log("err: get today work logs: ", error);
        return null;
    }
};

export const m_wlSingleUpdateHours = async ({
    wlid,
    s_time,
    e_time,
    b_hour,
}: {
    wlid: string;
    s_time: string;
    e_time: string;
    b_hour: string;
}) => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `
            UPDATE ${DB_TABLE_LIST.WORK_LOGS} 
            SET s_time = ?, e_time = ?, b_hour = ?
            WHERE wlid = ?;`,
            [s_time, e_time, b_hour, wlid]
        );
        connection.release();
        return rows as ResultSetHeader;
    } catch (error) {
        console.log("err: single update work log hours: ", error);
        return null;
    }
};

export const m_wlSingleArchive = async (wlid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `UPDATE ${DB_TABLE_LIST.WORK_LOGS} SET archive = 1 WHERE wlid = ?;`,
            [wlid]
        );
        connection.release();
        return rows as ResultSetHeader;
    } catch (error) {
        console.log("err: single archive work log: ", error);
        return null;
    }
};

export const m_wlGetBTimeWID = async (wlid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `SELECT b_hour FROM ${DB_TABLE_LIST.WORK_LOGS} WHERE wlid = ?;`,
            [wlid]
        );
        connection.release();
        return rows as RowDataPacket[];
    } catch (error) {
        console.log("err: get b_hour with wlid: ", error);
        return ["00:00"];
    }
};

export const m_wlUpdateBTime = async (wlid: string, b_hour: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `UPDATE ${DB_TABLE_LIST.WORK_LOGS} SET b_hour = ? WHERE wlid = ?;`,
            [b_hour, wlid]
        );
        connection.release();
        return rows as ResultSetHeader;
    } catch (error) {
        console.log("err: update b_hour with wlid: ", error);
        return null;
    }
};

export const m_wlStartWork = async (time: string, wlid: string) => {
    try {
        console.log("-> m_wlStartWork api: ", time, wlid);
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `UPDATE ${DB_TABLE_LIST.WORK_LOGS} SET s_time = ?, wl_status = ? WHERE wlid = ?;`,
            [time, "ongoing", wlid]
        );
        connection.release();
        return rows as ResultSetHeader;
    } catch (error) {
        console.log("err: start work: ", error);
        return null;
    }
};

export const m_wlResetWorkTime = async (wlid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `UPDATE ${DB_TABLE_LIST.WORK_LOGS} SET s_time = ?, e_time = ?, b_time = ?, wl_status = ? WHERE wlid = ?;`,
            ["00:00", "00:00", "00:00", "pending", wlid]
        );
        connection.release();
        return rows as ResultSetHeader;
    } catch (error) {
        console.log("err: reset work time: ", error);
        return null;
    }
};
