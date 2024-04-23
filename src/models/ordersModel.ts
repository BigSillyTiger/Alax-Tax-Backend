import { DB_TABLE_LIST } from "../utils/config";
import logger from "../libs/logger";
import adminPool from "./adminPool";
import type { Tpayment, Torder, TorderDesc } from "../utils/global";
import { ResultSetHeader, RowDataPacket } from "mysql2";

/**
 *
 * @returns
 */
export const m_orderGetAll = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `SELECT ${DB_TABLE_LIST.ORDER_LIST}.*, ${DB_TABLE_LIST.CLIENT}.first_name, ${DB_TABLE_LIST.CLIENT}.last_name, ${DB_TABLE_LIST.CLIENT}.phone FROM ${DB_TABLE_LIST.ORDER_LIST} INNER JOIN ${DB_TABLE_LIST.CLIENT} ON ${DB_TABLE_LIST.ORDER_LIST}.fk_cid = ${DB_TABLE_LIST.CLIENT}.cid ORDER BY created_date DESC`
        );
        connection.release();
        return rows;
    } catch (err) {
        console.log("err: get all orders: ", err);
        return null;
    }
};

export const m_orderGetAllWithDetails = async () => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT 
                A.oid, 
                A.fk_cid,
                A.address,
                A.suburb,
                A.city,
                A.state,
                A.country,
                A.postcode,
                A.status,
                A.deposit,
                A.gst,
                A.total,
                A.paid,
                A.created_date,
                A.invoice_date,
                (SELECT 
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'ranking', B.ranking,
                            'fk_oid', B.fk_oid,
                            'title', B.title,
                            'description', B.description,
                            'qty', B.qty,
                            'unit', B.unit,
                            'taxable', B.taxable,
                            'unit_price', B.unit_price,
                            'gst', B.gst,
                            'netto', B.netto
                        )
                    ) 
                FROM ${DB_TABLE_LIST.ORDER_SERVICE} B 
                WHERE B.fk_oid = A.oid) AS order_services,
                (SELECT 
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'pid', P.pid,
                            'fk_oid', P.fk_oid,
                            'paid', P.paid,
                            'paid_date', P.paid_date
                        )
                    ) 
                FROM ${DB_TABLE_LIST.PAYMENT} P 
                WHERE P.fk_oid = A.oid) AS payments,
                (SELECT 
                    JSON_OBJECT(
                        'cid', C.cid,
                        'first_name', C.first_name,
                        'last_name', C.last_name,
                        'phone', C.phone,
                        'email', C.email,
                        'address', C.address,
                        'suburb', C.suburb,
                        'city', C.city,
                        'state', C.state,
                        'country', C.country,
                        'postcode', C.postcode
                    )
                FROM ${DB_TABLE_LIST.CLIENT} C 
                WHERE C.cid = A.fk_cid) AS client_info
            FROM ${DB_TABLE_LIST.ORDER_LIST} A
            WHERE A.archive = 0;
            `
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: get all orders with details: ", err);
        return null;
    }
};

export const m_orderInsert = async (order: Torder) => {
    try {
        console.log("-> inser order: ", order);
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.ORDER_LIST} (oid, fk_cid, address, suburb, city, state, country, postcode, status, deposit, gst, total ) VALUES ?`,
            [
                [
                    [
                        order.oid,
                        order.fk_cid,
                        order.address,
                        order.suburb,
                        order.city,
                        order.state,
                        order.country,
                        order.postcode,
                        order.status,
                        order.deposit,
                        order.gst,
                        order.total,
                    ],
                ],
            ]
        );
        connection.release();
        //console.log("-> insert order result: ", result[0]);
        return result[0];
    } catch (err) {
        console.log("err: insert order: ", err);
        return null;
    }
};

export const m_orderDescInsert = async (order_services: TorderDesc) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.ORDER_SERVICE} (fk_oid, ranking, title, description, qty, taxable, unit, unit_price, gst, netto) VALUES ?`,
            [order_services]
        );
        connection.release();
        return result as ResultSetHeader;
    } catch (err) {
        console.log("err: insert order_services: ", err);
        return null;
    }
};

export const m_clientOrders = async (cid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.ORDER_LIST} WHERE fk_cid = ?`,
            [cid]
        );
        connection.release();
        //console.log(`-> id[${cid}] orders: `, result[0]);
        return result as RowDataPacket[];
    } catch (err) {
        console.log("err: get client orders: ", err);
        return null;
    }
};

export const m_clientOrderWichId = async (cid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `
            SELECT 
                A.oid, 
                A.fk_cid,  
                A.address,
                A.suburb,
                A.city,
                A.state,
                A.country,
                A.postcode,
                A.status,
                A.deposit,
                A.gst,
                A.total,
                A.paid,
                A.created_date,
                A.invoice_date,
                order_services,
                payments,
                client_info
            FROM ${DB_TABLE_LIST.ORDER_LIST} A
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
                    ) AS order_services
                FROM ${DB_TABLE_LIST.ORDER_SERVICE}
                GROUP BY fk_oid
            ) B ON A.oid = B.fk_oid
            LEFT JOIN (
                SELECT 
                    fk_oid,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'pid', pid,
                            'fk_oid', fk_oid,
                            'paid', paid,
                            'paid_date', paid_date
                        )
                    ) AS payments
                FROM ${DB_TABLE_LIST.PAYMENT}
                GROUP BY fk_oid 
            ) P ON A.oid = P.fk_oid
            LEFT JOIN (
                SELECT
                    cid,
                    JSON_OBJECT(
                        'cid', cid,
                        'first_name', first_name,
                        'last_name', last_name,
                        'phone', phone,
                        'email', email,
                        'address', address,
                        'suburb', suburb,
                        'city', city,
                        'state', state,
                        'country', country,
                        'postcode', postcode
                    ) AS client_info
                FROM ${DB_TABLE_LIST.CLIENT} 
            ) C ON A.fk_cid = C.cid
            WHERE A.fk_cid = ? AND A.archive = 0;
            `,
            [cid]
        );
        connection.release();
        return rows as RowDataPacket[];
    } catch (err) {
        console.log("err: get client order with id: ", err);
        return null;
    }
};

export const m_orderDel = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.ORDER_LIST} WHERE oid = ?`,
            [oid]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: delete order: ", err);
        return null;
    }
};

export const m_orderArchive = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_LIST} SET archive = ? WHERE oid = ?`,
            [1, oid]
        );
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.WORK_LOG} SET archive = ? WHERE fk_oid = ?`,
            [1, oid]
        );
        await connection.query("COMMIT;");
        connection.release();

        //console.log("-> archive order result: ", result);
        return true;
    } catch (err) {
        console.log("err: archive order: ", err);
        return false;
    }
};

export const m_orderDescDel = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.ORDER_SERVICE} WHERE fk_oid = ?`,
            [oid]
        );
        connection.release();
        //console.log("-> delete order_services result: ", result);
        return result[0];
    } catch (error) {
        console.log("err: delete order_services: ", error);
        return null;
    }
};

export const m_orderStatusUpdate = async (oid: string, status: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_LIST} SET status = ? WHERE oid = ?`,
            [status, oid]
        );
        connection.release();
        //console.log("-> update order status result: ", result[0]);
        return result[0];
    } catch (err) {
        console.log("err: update order status: ", err);
        return null;
    }
};

export const m_orderUpdateProperty = async (
    property: string,
    value: any,
    oid: string
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_LIST} SET ${property} = ? WHERE oid = ?`,
            [value, oid]
        );
        connection.release();
        //console.log(`-> update order[${property}] result: `, result[0]);
        return result[0];
    } catch (error) {
        console.log(`err: update order[${property}] : `, error);
        return null;
    }
};

export const m_orderUpdateWithDesc = async (
    order: Torder,
    oid: string,
    order_services: TorderDesc
) => {
    try {
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_LIST} SET 
                address = ?, 
                suburb = ?, 
                city = ?, 
                state = ?, 
                country = ?, 
                postcode = ?, 
                status = ?, 
                deposit = ?, 
                gst = ?, 
                total = ? 
            WHERE oid = ?`,
            [
                order.address,
                order.suburb,
                order.city,
                order.state,
                order.country,
                order.postcode,
                order.status,
                order.deposit,
                order.gst,
                order.total,
                order.oid,
            ]
        );
        await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.ORDER_SERVICE} WHERE fk_oid = ?`,
            [oid]
        );
        await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.ORDER_SERVICE} (fk_oid, ranking, title, description, qty, taxable, unit, unit_price, gst, netto) VALUES ?`,
            [order_services]
        );
        await connection.query("COMMIT;");
        connection.release();
        console.log("-> success update order with desc");
        return true;
    } catch (error) {
        console.log("-> failed update order with desc: ", error);
        return false;
    }
};

export const m_orderUpdate = async (order: Torder) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_LIST} SET 
                address = ?, 
                suburb = ?, 
                city = ?, 
                state = ?, 
                country = ?, 
                postcode = ?, 
                status = ?, 
                deposit = ?, 
                gst = ?, 
                total = ? 
            WHERE oid = ?`,
            [
                order.address,
                order.suburb,
                order.city,
                order.state,
                order.country,
                order.postcode,
                order.status,
                order.deposit,
                order.gst,
                order.total,
                order.oid,
            ]
        );
        connection.release();
        //console.log("-> update order result: ", result[0]);
        return result[0];
    } catch (error) {
        console.log("err: update order: ", error);
        return null;
    }
};

export const m_deletePayment = async (fk_oid: string) => {
    try {
        //console.log("-> delete payment: ", fk_oid);
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.PAYMENT} WHERE fk_oid = ?`,
            [fk_oid]
        );
        connection.release();
        //console.log("-> delete payment result: ", result[0]);
        return result[0];
    } catch (error) {
        console.log("err: delete payment: ", error);
        return null;
    }
};

export const m_updatePayments = async (payments: Tpayment) => {
    try {
        //console.log("-> before insert payments: ", payments);
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.PAYMENT} (fk_oid, paid, paid_date) VALUES ?`,
            [payments]
        );
        connection.release();
        console.log("-> update payment result: ", result);
        return result[0];
    } catch (error) {
        console.log("err: update payment: ", error);
        return null;
    }
};

export const m_orderUpdatePayments = async (
    fk_oid: string,
    payments: Tpayment[],
    totalPaid: number
) => {
    try {
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");
        await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.PAYMENT} WHERE fk_oid = ?;`,
            [fk_oid]
        );
        await connection.query(
            `
            INSERT INTO ${DB_TABLE_LIST.PAYMENT} (pid, fk_oid, paid, paid_date) VALUES ?;
        `,
            [payments]
        );
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_LIST} SET paid = ? WHERE oid = ?`,
            [totalPaid, fk_oid]
        );
        await connection.query("COMMIT;");
        connection.release();
        return true;
    } catch (error) {
        console.log("err: update payment: ", error);
        return null;
    }
};

export const m_findClientID = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT fk_cid FROM orders WHERE oid = ?`,
            [oid]
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("err: find client: ", error);
        return null;
    }
};

export const m_findOrder = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT
                JSON_OBJECT(
                    'oid', A.oid, 
                    'fk_cid', A.fk_cid,  
                    'address', A.address,
                    'suburb', A.suburb,
                    'city', A.city,
                    'state', A.state,
                    'country', A.country,
                    'postcode', A.postcode,
                    'status', A.status,
                    'deposit', A.deposit,
                    'gst', A.gst,
                    'total', A.total,
                    'paid', A.paid,
                    'created_date', A.created_date,
                    'order_services', descriptions,
                    'payments', paymentData
                )
                FROM orders A
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
                        ) AS descriptions
                    FROM order_services
                    GROUP BY fk_oid
                ) B ON A.oid = B.fk_oid
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
                    FROM payments
                    GROUP BY fk_oid 
                ) P ON A.oid = P.fk_oid
                WHERE A.oid = ? AND A.archive = 0;
                `,
            [oid]
        );
        connection.release();
        /* console.log(
        `-> id[${cid}] orders: `,
        Object.values(result[0][0])[0]
    ); */
        return Object.values(result[0][0])[0];
    } catch (err) {
        console.log("err: get order with id: ", err);
        return null;
    }
};

export const m_ordersLastOID = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT oid FROM ${DB_TABLE_LIST.ORDER_LIST} ORDER BY created_date DESC LIMIT 1`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("err: get last uid: ", error);
        return null;
    }
};

export const m_paymentLastPID = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query<RowDataPacket[]>(
            `SELECT pid FROM ${DB_TABLE_LIST.PAYMENT} ORDER BY pid DESC LIMIT 1;`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("-> error: retrieve last pid - ", error);
        return null;
    }
};

export const m_paymentALL = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT paid, paid_date FROM ${DB_TABLE_LIST.PAYMENT}`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("-> error: retrieve all payments - ", error);
        return null;
    }
};
