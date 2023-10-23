import { DB_TABLE_LIST } from "../utils/config";
import logger from "../utils/logger";
import adminPool from "./adminPool";

type Torder = {
    fk_client_id: number;
    order_address: string;
    order_suburb: string;
    order_city: string;
    order_state: string;
    order_country: string;
    order_pc: string;
};

type TorderDesc = {
    fk_order_id: number;
    ranking: number;
    description: string;
    qty: number;
    unit: string;
    unit_price: number;
    netto: number;
}[];

export const m_orderGetAll = async () => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.ORDERS}`
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: get all orders: ", err);
        return null;
    }
};

export const m_orderInsert = async (order: Torder) => {
    try {
        console.log("-> inser order: ", order);
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.ORDERS} (fk_client_id, order_address, order_suburb, order_city, order_state, order_country, order_pc) VALUES ?`,
            [
                [
                    [
                        order.fk_client_id,
                        order.order_address,
                        order.order_suburb,
                        order.order_city,
                        order.order_state,
                        order.order_country,
                        order.order_pc,
                    ],
                ],
            ]
        );
        connection.release();
        console.log("-> insert order result: ", result[0]);
        return result[0];
    } catch (err) {
        console.log("err: insert order: ", err);
        return null;
    }
};

export const m_orderDescInsert = async (order_desc: TorderDesc) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.ORDER_DESC} (fk_order_id, ranking, description, qty, unit, unit_price, netto) VALUES ?`,
            [order_desc]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: insert order_desc: ", err);
        return null;
    }
};

export const m_clientOrders = async (client_id: number) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.ORDERS} WHERE fk_client_id = ?`,
            [client_id]
        );
        connection.release();
        console.log(`-> id[${client_id}] orders: `, result[0]);
        return result[0];
    } catch (err) {
        console.log("err: get client orders: ", err);
        return null;
    }
};

export const m_clientOrderWichId = async (client_id: number) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT 
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'order_id', A.order_id, 
                    'fk_invoice_id', A.fk_invoice_id,  
                    'order_address', A.order_address,
                    'order_suburb', A.order_suburb,
                    'order_city', A.order_city,
                    'order_state', A.order_state,
                    'order_country', A.order_country,
                    'order_pc', A.order_pc,
                    'order_status', A.order_status,
                    'order_date', A.order_date,
                    'order_desc', descriptions
                )
            )
        FROM orders A
        JOIN (
            SELECT 
                fk_order_id,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'ranking', ranking,
                        'description', description,
                        'qty', qty,
                        'unit', unit,
                        'unit_price', unit_price,
                        'netto', netto
                    )
                ) AS descriptions
            FROM order_desc
            GROUP BY fk_order_id
        ) B ON A.order_id = B.fk_order_id
        WHERE A.fk_client_id = ?;
        `,
            [client_id]
        );
        connection.release();
        //console.log(`-> id[${client_id}] orders: `, result[0][0]);
        return Object.values(result[0][0])[0];
    } catch (err) {
        console.log("err: get client order with id: ", err);
        return null;
    }
};
