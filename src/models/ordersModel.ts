import { DB_TABLE_LIST } from "../utils/config";
import logger from "../utils/logger";
import adminPool from "./adminPool";

type Torder = {
    oid?: string; // new order does not have oid
    fk_client_id: string;
    address: string;
    suburb: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    status: string;
    deposit: number;
    gst: number;
    total: number;
};

type TorderDesc = {
    fk_order_id: string;
    tital: string;
    taxable: boolean;
    description: string;
    qty: number;
    unit: string;
    unit_price: number;
    gst: number;
    netto: number;
}[];

type Tpayment = {
    fk_order_id: string;
    paid: number;
    paid_date: string;
};

/**
 *
 * @returns
 */
export const m_orderGetAll = async () => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT ${DB_TABLE_LIST.ORDERS}.*, ${DB_TABLE_LIST.CLIENTS}.first_name, ${DB_TABLE_LIST.CLIENTS}.last_name, ${DB_TABLE_LIST.CLIENTS}.phone FROM ${DB_TABLE_LIST.ORDERS} INNER JOIN ${DB_TABLE_LIST.CLIENTS} ON ${DB_TABLE_LIST.ORDERS}.fk_client_id = ${DB_TABLE_LIST.CLIENTS}.cid ORDER BY created_date DESC`
        );
        connection.release();
        return result[0];
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
                A.fk_client_id,
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
                A.invoice_issue_date,
                (SELECT 
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'ranking', B.ranking,
                            'fk_order_id', B.fk_order_id,
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
                FROM ${DB_TABLE_LIST.ORDER_SERVICES} B 
                WHERE B.fk_order_id = A.oid) AS order_services,
                (SELECT 
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'fk_order_id', P.fk_order_id,
                            'paid', P.paid,
                            'paid_date', P.paid_date
                        )
                    ) 
                FROM ${DB_TABLE_LIST.PAYMENTS} P 
                WHERE P.fk_order_id = A.oid) AS payments,
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
                FROM ${DB_TABLE_LIST.CLIENTS} C 
                WHERE C.cid = A.fk_client_id) AS client_info
            FROM ${DB_TABLE_LIST.ORDERS} A
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
            `INSERT INTO ${DB_TABLE_LIST.ORDERS} (oid, fk_client_id, address, suburb, city, state, country, postcode, status, deposit, gst, total ) VALUES ?`,
            [
                [
                    [
                        order.oid,
                        order.fk_client_id,
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
        const result: any = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.ORDER_SERVICES} (fk_order_id, ranking, title, description, qty, taxable, unit, unit_price, gst, netto) VALUES ?`,
            [order_services]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: insert order_services: ", err);
        return null;
    }
};

export const m_clientOrders = async (cid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.ORDERS} WHERE fk_client_id = ?`,
            [cid]
        );
        connection.release();
        //console.log(`-> id[${cid}] orders: `, result[0]);
        return result[0];
    } catch (err) {
        console.log("err: get client orders: ", err);
        return null;
    }
};

export const m_clientOrderWichId = async (cid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT 
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'oid', A.oid, 
                    'fk_client_id', A.fk_client_id,  
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
                    'invoice_issue_date', A.invoice_issue_date,
                    'order_services', descriptions,
                    'payments', paymentData,
                    'client_info', clientInfo
                )
            )
        FROM ${DB_TABLE_LIST.ORDERS} A
        JOIN (
            SELECT 
                fk_order_id,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'ranking', ranking,
                        'fk_order_id', fk_order_id,
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
            FROM ${DB_TABLE_LIST.ORDER_SERVICES}
            GROUP BY fk_order_id
        ) B ON A.oid = B.fk_order_id
        LEFT JOIN (
            SELECT 
                fk_order_id,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'fk_order_id', fk_order_id,
                        'paid', paid,
                        'paid_date', paid_date
                    )
                ) AS paymentData
            FROM ${DB_TABLE_LIST.PAYMENTS}
            GROUP BY fk_order_id 
        ) P ON A.oid = P.fk_order_id
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
                ) AS clientInfo
            FROM ${DB_TABLE_LIST.CLIENTS} 
        ) C ON A.fk_client_id = C.cid
        WHERE A.fk_client_id = ? AND A.archive = 0;
        `,
            [cid]
        );
        connection.release();
        /* console.log(
            `-> id[${cid}] orders: `,
            Object.values(result[0][0])[0]
        ); */
        return Object.values(result[0][0])[0];
    } catch (err) {
        console.log("err: get client order with id: ", err);
        return null;
    }
};

export const m_orderDel = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.ORDERS} WHERE oid = ?`,
            [oid]
        );
        connection.release();
        //console.log("-> delete order result: ", result);
        return result[0];
    } catch (err) {
        console.log("err: delete order: ", err);
        return null;
    }
};

export const m_orderArchive = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDERS} SET archive = ? WHERE oid = ?`,
            [1, oid]
        );
        connection.release();
        //console.log("-> archive order result: ", result);
        return result[0];
    } catch (err) {
        console.log("err: archive order: ", err);
        return null;
    }
};

export const m_orderDescDel = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.ORDER_SERVICES} WHERE fk_order_id = ?`,
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
            `UPDATE ${DB_TABLE_LIST.ORDERS} SET status = ? WHERE oid = ?`,
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
            `UPDATE ${DB_TABLE_LIST.ORDERS} SET ${property} = ? WHERE oid = ?`,
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

export const m_orderUpdate = async (order: Torder) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDERS} SET 
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

export const m_deletePayment = async (fk_order_id: string) => {
    try {
        //console.log("-> delete payment: ", fk_order_id);
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.PAYMENTS} WHERE fk_order_id = ?`,
            [fk_order_id]
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
            `INSERT INTO ${DB_TABLE_LIST.PAYMENTS} (fk_order_id, paid, paid_date) VALUES ?`,
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

export const m_findClientID = async (oid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT fk_client_id FROM orders WHERE oid = ?`,
            [oid]
        );
        connection.release();
        return result[0];
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
                    'fk_client_id', A.fk_client_id,  
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
                        fk_order_id,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'ranking', ranking,
                                'fk_order_id', fk_order_id,
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
                    GROUP BY fk_order_id
                ) B ON A.oid = B.fk_order_id
                LEFT JOIN (
                    SELECT 
                        fk_order_id,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'fk_order_id', fk_order_id,
                                'paid', paid,
                                'paid_date', paid_date
                            )
                        ) AS paymentData
                    FROM payments
                    GROUP BY fk_order_id 
                ) P ON A.oid = P.fk_order_id
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

export const m_uidGetLastOrder = async () => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT oid FROM ${DB_TABLE_LIST.ORDERS} ORDER BY created_date DESC LIMIT 1`
        );
        connection.release();
        return result[0];
    } catch (error) {
        console.log("err: get last uid: ", error);
        return null;
    }
};
