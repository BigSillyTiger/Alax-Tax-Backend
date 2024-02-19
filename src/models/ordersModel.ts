import { DB_TABLE_LIST } from "../utils/config";
import logger from "../utils/logger";
import adminPool from "./adminPool";

type Torder = {
    order_id?: string; // new order does not have order_id
    fk_client_id: string;
    order_address: string;
    order_suburb: string;
    order_city: string;
    order_state: string;
    order_country: string;
    order_pc: string;
    order_status: string;
    order_deposit: number;
    order_gst: number;
    order_total: number;
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
            `SELECT ${DB_TABLE_LIST.ORDERS}.*, ${DB_TABLE_LIST.CLIENTS}.first_name, ${DB_TABLE_LIST.CLIENTS}.last_name, ${DB_TABLE_LIST.CLIENTS}.phone FROM ${DB_TABLE_LIST.ORDERS} INNER JOIN ${DB_TABLE_LIST.CLIENTS} ON ${DB_TABLE_LIST.ORDERS}.fk_client_id = ${DB_TABLE_LIST.CLIENTS}.client_id ORDER BY order_date DESC`
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
                A.order_id, 
                A.fk_client_id,
                A.order_address,
                A.order_suburb,
                A.order_city,
                A.order_state,
                A.order_country,
                A.order_pc,
                A.order_status,
                A.order_deposit,
                A.order_gst,
                A.order_total,
                A.order_paid,
                A.order_date,
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
                WHERE B.fk_order_id = A.order_id) AS order_services,
                (SELECT 
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'fk_order_id', P.fk_order_id,
                            'paid', P.paid,
                            'paid_date', P.paid_date
                        )
                    ) 
                FROM ${DB_TABLE_LIST.PAYMENTS} P 
                WHERE P.fk_order_id = A.order_id) AS payments,
                (SELECT 
                    JSON_OBJECT(
                        'client_id', C.client_id,
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
                WHERE C.client_id = A.fk_client_id) AS client_info
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
            `INSERT INTO ${DB_TABLE_LIST.ORDERS} (order_id, fk_client_id, order_address, order_suburb, order_city, order_state, order_country, order_pc, order_status, order_deposit, order_gst, order_total ) VALUES ?`,
            [
                [
                    [
                        order.order_id,
                        order.fk_client_id,
                        order.order_address,
                        order.order_suburb,
                        order.order_city,
                        order.order_state,
                        order.order_country,
                        order.order_pc,
                        order.order_status,
                        order.order_deposit,
                        order.order_gst,
                        order.order_total,
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

export const m_clientOrders = async (client_id: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.ORDERS} WHERE fk_client_id = ?`,
            [client_id]
        );
        connection.release();
        //console.log(`-> id[${client_id}] orders: `, result[0]);
        return result[0];
    } catch (err) {
        console.log("err: get client orders: ", err);
        return null;
    }
};

export const m_clientOrderWichId = async (client_id: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT 
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'order_id', A.order_id, 
                    'fk_client_id', A.fk_client_id,  
                    'order_address', A.order_address,
                    'order_suburb', A.order_suburb,
                    'order_city', A.order_city,
                    'order_state', A.order_state,
                    'order_country', A.order_country,
                    'order_pc', A.order_pc,
                    'order_status', A.order_status,
                    'order_deposit', A.order_deposit,
                    'order_gst', A.order_gst,
                    'order_total', A.order_total,
                    'order_paid', A.order_paid,
                    'order_date', A.order_date,
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
        ) B ON A.order_id = B.fk_order_id
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
        ) P ON A.order_id = P.fk_order_id
        LEFT JOIN (
            SELECT
                client_id,
                JSON_OBJECT(
                    'client_id', client_id,
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
        ) C ON A.fk_client_id = C.client_id
        WHERE A.fk_client_id = ? AND A.archive = 0;
        `,
            [client_id]
        );
        connection.release();
        /* console.log(
            `-> id[${client_id}] orders: `,
            Object.values(result[0][0])[0]
        ); */
        return Object.values(result[0][0])[0];
    } catch (err) {
        console.log("err: get client order with id: ", err);
        return null;
    }
};

export const m_orderDel = async (order_id: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.ORDERS} WHERE order_id = ?`,
            [order_id]
        );
        connection.release();
        //console.log("-> delete order result: ", result);
        return result[0];
    } catch (err) {
        console.log("err: delete order: ", err);
        return null;
    }
};

export const m_orderArchive = async (order_id: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDERS} SET archive = ? WHERE order_id = ?`,
            [1, order_id]
        );
        connection.release();
        //console.log("-> archive order result: ", result);
        return result[0];
    } catch (err) {
        console.log("err: archive order: ", err);
        return null;
    }
};

export const m_orderDescDel = async (order_id: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.ORDER_SERVICES} WHERE fk_order_id = ?`,
            [order_id]
        );
        connection.release();
        //console.log("-> delete order_services result: ", result);
        return result[0];
    } catch (error) {
        console.log("err: delete order_services: ", error);
        return null;
    }
};

export const m_orderStatusUpdate = async (order_id: string, status: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDERS} SET order_status = ? WHERE order_id = ?`,
            [status, order_id]
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
    order_id: string
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.ORDERS} SET ${property} = ? WHERE order_id = ?`,
            [value, order_id]
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
                order_address = ?, 
                order_suburb = ?, 
                order_city = ?, 
                order_state = ?, 
                order_country = ?, 
                order_pc = ?, 
                order_status = ?, 
                order_deposit = ?, 
                order_gst = ?, 
                order_total = ? 
            WHERE order_id = ?`,
            [
                order.order_address,
                order.order_suburb,
                order.order_city,
                order.order_state,
                order.order_country,
                order.order_pc,
                order.order_status,
                order.order_deposit,
                order.order_gst,
                order.order_total,
                order.order_id,
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

export const m_findClientID = async (order_id: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT fk_client_id FROM orders WHERE order_id = ?`,
            [order_id]
        );
        connection.release();
        return result[0];
    } catch (error) {
        console.log("err: find client: ", error);
        return null;
    }
};

export const m_findOrder = async (order_id: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT
                JSON_OBJECT(
                    'order_id', A.order_id, 
                    'fk_client_id', A.fk_client_id,  
                    'order_address', A.order_address,
                    'order_suburb', A.order_suburb,
                    'order_city', A.order_city,
                    'order_state', A.order_state,
                    'order_country', A.order_country,
                    'order_pc', A.order_pc,
                    'order_status', A.order_status,
                    'order_deposit', A.order_deposit,
                    'order_gst', A.order_gst,
                    'order_total', A.order_total,
                    'order_paid', A.order_paid,
                    'order_date', A.order_date,
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
                ) B ON A.order_id = B.fk_order_id
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
                ) P ON A.order_id = P.fk_order_id
                WHERE A.order_id = ? AND A.archive = 0;
                `,
            [order_id]
        );
        connection.release();
        /* console.log(
        `-> id[${client_id}] orders: `,
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
            `SELECT order_id FROM ${DB_TABLE_LIST.ORDERS} ORDER BY order_date DESC LIMIT 1`
        );
        connection.release();
        return result[0];
    } catch (error) {
        console.log("err: get last uid: ", error);
        return null;
    }
};
