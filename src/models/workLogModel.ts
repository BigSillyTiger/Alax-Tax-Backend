import { DB_TABLE_LIST, uidPrefix } from "../utils/config";
import adminPool from "./adminPool";

export const m_getLastWorkLog = async () => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.WORK_LOGS} ORDER BY id DESC LIMIT 1`
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: get last work log: ", err);
        return null;
    }
};

export const m_getAllOrdersWithWorkLog = async () => {
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
                        'last_name', c.last_name
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
                            'fk_oid', COALESCE(logs.fk_oid, O.oid),
                            'wl_date', logs.wl_date,
                            'logs', logs.logs_array
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
                                'wl_date', wl.wl_date,
                                'e_time', wl.e_time,
                                's_time', wl.s_time,
                                'wl_note', wl.wl_note,
                                'wl_status', wl.wl_status,
                                'confirm_status', wl.confirm_status,
                                'first_name', s.first_name,
                                'last_name', s.last_name,
                                'phone', s.phone,
                                'email', s.email,
                                'role', s.role
                            )
                        ) AS logs_array
                    FROM ${DB_TABLE_LIST.WORK_LOGS} wl
                    JOIN staff s ON wl.fk_uid = s.uid
                    GROUP BY wl.fk_oid, wl.wl_date, s.first_name
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
