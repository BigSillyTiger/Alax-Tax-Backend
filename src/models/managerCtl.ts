import logger from "../utils/logger";
import adminPool from "./adminPool";
import { DB_TABLE_LIST, sleep } from "../utils/config";

/**
 *
 * @param param0
 * @returns number: uid always > 0, false if error
 */
export const m_addManager = async (
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    password: string
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.MANAGERS} (first_name, last_name, email, phone, password) VALUES(?,?,?,?,?)`,
            [first_name, last_name, email, phone, password]
        );
        console.log("-> insert result: ", result);
        connection.release();
        return result[0].insertId;
    } catch (err) {
        return false;
    }
};

/**
 *
 * @param phone
 * @param email
 * @returns boolean: true if no duplicate, false if duplicate or error
 */
export const m_searchMPhoneEmail = async (phone: string, email: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.MANAGERS} WHERE phone = ? OR email = ?`,
            [phone, email]
        );
        connection.release();
        return result[0][0];
    } catch (err) {
        logger.errLog(err);
        return "";
    }
};

/**
 *
 * @param email
 * @returns {uid: number, password: string} | null
 */
export const m_searchMbyEmail = async (email: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT uid, password FROM ${DB_TABLE_LIST.MANAGERS} WHERE email = ?`,
            [email]
        );
        connection.release();
        return result[0][0];
    } catch (err) {
        logger.errLog(err);
        return null;
    }
};

/**
 *
 * @param param0
 * @returns boolean true if success, false if error
 */
export const m_insertLevel = async ({
    cid,
    dashboard,
    clients,
    orders,
    employees,
    management,
}: {
    cid: number;
    dashboard: number;
    clients: number;
    orders: number;
    employees: number;
    management: number;
}) => {
    try {
        const connection = await adminPool.getConnection();
        const result = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.ADMIN_LEVEL} (fk_uid, dashboard, clients, orders, employees, management) VALUES(?,?,?,?,?,?)`,
            [cid, dashboard, clients, orders, employees, management]
        );
        return result;
    } catch (err) {
        logger.errLog(err);
        return "";
    }
};

type Tlv = [
    [
        {
            dashboard: number;
            clients: number;
            orders: number;
            calendar: number;
            employees: number;
            management: number;
        }
    ]
];

export const m_levelCheck = async (uid: number) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT dashboard, clients, orders, calendar, employees, management FROM ${DB_TABLE_LIST.ADMIN_LEVEL} WHERE fk_uid = ${uid}`
        );
        connection.release();
        return result[0][0];
    } catch (err) {
        logger.errLog(err);
        return null;
    }
};

export const m_checkEmail = async (email: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.MANAGERS} WHERE email = ?`,
            [email]
        );
        connection.release();
        return result;
    } catch (err) {
        logger.errLog(err);
        return "";
    }
};
