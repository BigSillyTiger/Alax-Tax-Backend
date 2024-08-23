import { DB_TABLE_LIST } from "../utils/config";
import logger from "../libs/logger";
import adminPool from "../config/adminPool";
import type { Tpayment, Torder, Tservice } from "../utils/global";
import { ResultSetHeader, RowDataPacket } from "mysql2";

/**
 *
 * @returns TorderAbstract
 */
export const order_allAbstract = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT
                o.oid, o.fk_cid, o.status, o.status, o.archive, o.q_deposit, o.q_valid, o.q_date, o.total, o.gst, o.net, o.paid, o.created_date, o.estimate_finish_date, o.i_date, o.note,
                c.first_name, c.last_name, c.phone, c.email
            FROM ${DB_TABLE_LIST.ORDER_LIST} o
            JOIN ${DB_TABLE_LIST.CLIENT} c ON o.fk_cid = c.cid
            WHERE o.deleted = 0;
            `
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (err) {
        console.log("err: get all orders abstract: ", err);
        return null;
    }
};

/**
 * @description get all orders with details
 *              deatils: order_services, payments, client_info
 * @returns
 */
export const order_allWithDetails = async () => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT 
                A.oid, 
                A.fk_cid,
                A.status,
                A.q_deposit,
                A.q_valid,
                A.q_date,
                A.gst,
                A.net,
                A.total,
                A.paid,
                A.created_date,
                A.estimate_finish_date,
                A.i_date,
                A.i_date, 
                (SELECT 
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'osid', B.osid,
                            'fk_oid', B.fk_oid,
                            'ranking', B.ranking,
                            'title', B.title,
                            'note', B.note,
                            'taxable', B.taxable,
                            'qty', B.qty,
                            'unit', B.unit,
                            'unit_price', B.unit_price,
                            'gst', B.gst,
                            'net', B.net,
                            'status', B.status,
                            'created_date', B.created_date,
                            'archive', B.archive,
                            'service_type', B.service_type,
                            'product_name', B.product_name                            
                        )
                    ) 
                    FROM ${DB_TABLE_LIST.ORDER_SERVICE} B 
                    WHERE B.fk_oid = A.oid
                ) AS order_services,
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
                    WHERE P.fk_oid = A.oid
                ) AS payments,
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
                    WHERE C.cid = A.fk_cid
                ) AS client_info
            FROM ${DB_TABLE_LIST.ORDER_LIST} A
            WHERE A.deleted = 0;`
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: get all orders with details: ", err);
        return null;
    }
};

/**
 * @description get all order services with client info
 * @returns
 */
export const order_allServicesWithClient = async () => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT 
                A.osid,
                A.fk_oid, 
                A.fk_cid,
                A.title,
                A.status,
                A.qty,
                A.unit,
                A.unit_price,
                A.gst,
                A.taxable,
                A.net,
                A.created_date,
                A.expiry_date,
                A.archive,
                A.service_type,
                A.product_name,
                A.note,                
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
                    WHERE C.cid = A.fk_cid
                ) AS client_info
            FROM ${DB_TABLE_LIST.ORDER_SERVICE} A
            WHERE A.deleted = 0;`
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: get all order services with details: ", err);
        return null;
    }
};

/**
 * @description get all orders with details
 *              omit created_date, archive by using default
 * @param order
 * @returns
 */
export const order_insert = async (order: Torder, services: Tservice[]) => {
    try {
        console.log("-> order_insert order: ", order);
        // console.log("-> order_insert services: ", services);
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");

        await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.ORDER_LIST} (oid, fk_cid, status, gst, net, total, q_deposit, q_valid, q_date, estimate_finish_date, i_date, note ) VALUES ?`,
            [
                [
                    [
                        order.oid,
                        order.fk_cid,
                        order.status,
                        order.gst,
                        order.net,
                        order.total,
                        order.q_deposit,
                        order.q_valid,
                        order.q_date,
                        order.estimate_finish_date,
                        order.i_date,
                        order.note,
                    ],
                ],
            ]
        );
        await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.ORDER_SERVICE} (osid, fk_cid, fk_oid, title, taxable, qty, unit, unit_price, gst, net, ranking, status, created_date, service_type, product_name, note) VALUES ?`,
            [services]
        );
        await connection.query("COMMIT;");
        connection.release();
        //console.log("-> insert order result: ", result[0]);
        return true;
    } catch (err) {
        console.log("err: insert order: ", err);
        return new Error("Error order_insert");
    }
};

export const order_serviceInsert = async (services: Tservice[]) => {
    try {
        console.log("-> insert service: ", services);
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.ORDER_SERVICE} (osid, fk_cid, fk_oid, title, taxable, qty, unit, unit_price, gst, net, ranking, status, created_date, service_type, product_name, note) VALUES ?`,
            [services]
        );
        connection.release();
        return result as ResultSetHeader;
    } catch (err) {
        console.log("err: insert services: ", err);
        return null;
    }
};

/**
 * @description just orders from order_list table
 * @param cid
 * @returns
 */
export const order_clientOrders = async (cid: string) => {
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

/**
 * @description get client order service with cid
 * @param cid
 */
export const order_clientOrderService = async (cid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT osid, fk_oid, qty, unit, unit_price, taxable, gst, net, title, ranking, status, created_date, archive, expiry_date, service_type, product_name, note FROM ${DB_TABLE_LIST.ORDER_SERVICE} WHERE fk_cid = ? AND deleted = ?`,
            [cid, 0]
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (err) {
        console.log("err: get client order services: ", err);
        return new Error("Error order_clientOrderService");
    }
};

/**
 * @description get client order with data from order_list, order_service, payment, client tables
 * @param cid
 * @returns
 */
export const order_clientDetailedOrders = async (cid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `
            SELECT 
                A.oid, 
                A.fk_cid,
                A.status,
                A.q_deposit,
                A.q_valid,
                A.q_date,
                A.gst,
                A.net,
                A.total,
                A.paid,
                A.created_date,
                A.estimate_finish_date,
                A.i_date,
                A.note,
                order_services,
                payments,
                client_info
            FROM ${DB_TABLE_LIST.ORDER_LIST} A
            JOIN (
                SELECT 
                    fk_oid,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'osid', osid,
                            'fk_oid', fk_oid,
                            'ranking', ranking,
                            'title', title,
                            'note', note,
                            'taxable', taxable,
                            'qty', qty,
                            'unit', unit,
                            'unit_price', unit_price,
                            'gst', gst,
                            'net', net,
                            'status', status,
                            'created_date', created_date,
                            'archive', archive,
                            'service_type', service_type,
                            'product_name', product_name
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
            WHERE A.fk_cid = ? AND A.deleted = 0;
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

/**
 * @description not used
 * @param oid
 * @returns
 */
/* export const order_delete = async (oid: string) => {
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
}; */

/**
 * @description archive order
 *              - fail: if current order has payment record
 *              - fail: if current order has work log record
 *              - fail: if current order status is not pending nor cancelled
 * @param oid
 * @returns
 */
export const order_archive = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");

        // check if the order has payment record
        const [resultP] = await connection.query(
            `
            SELECT COUNT(pid) count FROM ${DB_TABLE_LIST.PAYMENT} WHERE fk_oid = ?`,
            [oid]
        );
        if ((resultP as RowDataPacket)[0].count > 0) {
            throw new Error("The order has payments, fail to archive");
        }

        // check if the order status is pending or cancelled
        const [resultS] = await connection.query(
            `SELECT status FROM ${DB_TABLE_LIST.ORDER_LIST} WHERE oid = ? AND archive = 0`,
            [oid]
        );

        if (
            (resultS as RowDataPacket)[0].status !== "pending" &&
            (resultS as RowDataPacket)[0].status !== "cancelled"
        ) {
            throw new Error(
                "The order status is not pending nor cancelled, fail to archive"
            );
        }

        await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_LIST} SET archive = ? WHERE oid = ?`,
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

/**
 * @description delete order
 *              - fail: if current order has payment record
 *              - fail: if current order status is not pending nor cancelled
 * @param oid
 * @returns
 */
export const order_delete = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");

        // check if the order has payment record
        const [resultP] = await connection.query(
            `
            SELECT COUNT(pid) count FROM ${DB_TABLE_LIST.PAYMENT} WHERE fk_oid = ?`,
            [oid]
        );
        if ((resultP as RowDataPacket)[0].count > 0) {
            throw new Error("The order has payments, fail to delete");
        }

        // check if the order status is pending or cancelled
        const [resultS] = await connection.query(
            `SELECT status FROM ${DB_TABLE_LIST.ORDER_LIST} WHERE oid = ? AND deleted = 0`,
            [oid]
        );

        if (
            (resultS as RowDataPacket)[0].status !== "pending" &&
            (resultS as RowDataPacket)[0].status !== "cancelled"
        ) {
            throw new Error(
                "The order status is not pending nor cancelled, fail to delete"
            );
        }

        await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_LIST} SET deleted = ? WHERE oid = ?`,
            [1, oid]
        );
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_SERVICE} SET deleted = ? WHERE fk_oid = ?`,
            [1, oid]
        );
        await connection.query("COMMIT;");
        connection.release();

        //console.log("-> delete order result: ", result);
        return true;
    } catch (err) {
        console.log("err: delete order: ", err);
        return false;
    }
};

export const order_deleteService = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_SERVICE} SET deleted = ? WHERE fk_oid = ?`,
            [1, oid]
        );
        connection.release();
        //console.log("-> delete order_services result: ", result);
        return result[0];
    } catch (error) {
        console.log("err: delete order_services: ", error);
        return null;
    }
};

export const order_updateStatus = async (oid: string, status: string) => {
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
        return new Error("Error order_updateStatus");
    }
};

export const order_updateServiceStatus = async (
    oid: string,
    status: string
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_SERVICE} SET status = ? WHERE fk_oid = ?`,
            [status, oid]
        );
        connection.release();
        //console.log("-> update order service status result: ", result[0]);
        return result[0];
    } catch (error) {
        console.log("err: update order service status: ", error);
        return new Error("Error order_updateServiceStatus");
    }
};

export const order_findService = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.ORDER_SERVICE} WHERE fk_oid = ?`,
            [oid]
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("err: find order service: ", error);
        return null;
    }
};

export const order_updateProperty = async (
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

export const order_updateWithService = async (
    order: Torder,
    oid: string,
    order_services: Tservice[]
) => {
    try {
        //console.log("--> order modal order_services: ", order_services);
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_LIST} SET 
                status = ?, 
                gst = ?, 
                net = ?,
                total = ?,
                paid = ?,
                q_deposit = ?,
                q_valid = ?,
                q_date = ?,
                estimate_finish_date = ?,
                i_date = ?,
                note = ?
            WHERE oid = ?`,
            [
                order.status,
                order.gst,
                order.net,
                order.total,
                order.paid,
                order.q_deposit,
                order.q_valid,
                order.q_date,
                order.estimate_finish_date,
                order.i_date,
                order.note,
                oid,
            ]
        );
        await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.ORDER_SERVICE} WHERE fk_oid = ?`,
            [oid]
        );
        //console.log("---> order_services: ", order_services);
        await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.ORDER_SERVICE} (osid, fk_cid, fk_oid, title, taxable, qty, unit, unit_price, gst, net, ranking, status, created_date, service_type, product_name, note) VALUES ?`,
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

/**
 * @description not used
 * @param order
 * @returns
 */
export const order_update = async (order: Torder) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDER_LIST} SET 
                status = ?, 
                gst = ?, 
                net = ?, 
                total = ?,
                paid = ?,
                q_deposit = ?,
                q_valid = ?,
                q_date = ?,
                estimate_finish_date = ?,
                i_date = ?,
                note = ?
            WHERE oid = ?`,
            [
                order.status,
                order.gst,
                order.total,
                order.paid,
                order.q_deposit,
                order.q_valid,
                order.q_date,
                order.estimate_finish_date,
                order.i_date,
                order.note,
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

/**
 * @description not used
 * @param fk_oid
 * @returns
 */
/* export const order_deletePayment = async (fk_oid: string) => {
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
}; */

/**
 * @description not used
 * @param payments
 * @returns
 */
/* export const order_updatePayment = async (payments: Tpayment) => {
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
}; */

export const order_updatePayment = async (
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
        if (payments?.length > 0) {
            await connection.query(
                `
                INSERT INTO ${DB_TABLE_LIST.PAYMENT} (pid, fk_oid, paid, paid_date) VALUES ?;
            `,
                [payments]
            );
        }
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

export const order_findCid = async (oid: string) => {
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

export const order_findOrder = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT
                JSON_OBJECT(
                    'oid', A.oid, 
                    'fk_cid', A.fk_cid,
                    'status', A.status,
                    'gst', A.gst,
                    'net', A.net,
                    'total', A.total,
                    'paid', A.paid,
                    'q_deposit', A.q_deposit,
                    'q_valid', A.q_valid,
                    'q_date', A.q_date,
                    'created_date', A.created_date,
                    'estimate_finish_date', A.estimate_finish_date,
                    'i_date', A.i_date,
                    'note', A.note,
                    'order_services', order_services,
                    'payments', paymentData
                )
                FROM orders A
                JOIN (
                    SELECT 
                        fk_oid,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'osid', B.osid,
                                'fk_oid', B.fk_oid,
                                'ranking', B.ranking,
                                'title', B.title,
                                'note', B.note,
                                'qty', B.qty,
                                'unit', B.unit,
                                'taxable', B.taxable,
                                'unit_price', B.unit_price,
                                'gst', B.gst,
                                'net', B.net,
                                'status', B.status,
                                'created_date', B.created_date,
                                'archive', B.archive,
                                'service_type', B.service_type,
                                'product_name', B.product_name
                            )
                        ) AS order_services
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
                WHERE A.oid = ? AND A.deleted = 0;
                `,
            [oid]
        );
        connection.release();

        return Object.values(result[0][0])[0];
    } catch (err) {
        console.log("err: get order with id: ", err);
        return null;
    }
};

export const order_lastOid = async () => {
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

export const order_lastOsid = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT osid FROM ${DB_TABLE_LIST.ORDER_SERVICE} ORDER BY osid DESC LIMIT 1`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("err: get last uid: ", error);
        return null;
    }
};

export const order_lastPid = async () => {
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

export const order_allPayment = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT p.paid, p.paid_date FROM ${DB_TABLE_LIST.PAYMENT} p JOIN ${DB_TABLE_LIST.ORDER_LIST} o ON p.fk_oid = o.oid WHERE o.deleted = 0`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("-> error: retrieve all payments - ", error);
        return null;
    }
};

export const order_allCreatedDate = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT created_date FROM ${DB_TABLE_LIST.ORDER_LIST} WHERE deleted = 0`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("-> error: retrieve all orders count - ", error);
        return null;
    }
};

export const order_allUnpaid = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT (total - paid) * -1 as unpaid, created_date FROM ${DB_TABLE_LIST.ORDER_LIST} WHERE deleted = 0`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (error) {
        console.log("-> error: retrieve all unpaid orders - ", error);
        return null;
    }
};
