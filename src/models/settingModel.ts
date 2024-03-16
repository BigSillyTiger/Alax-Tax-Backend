import logger from "../utils/logger";
import adminPool from "./adminPool";
import { DB_TABLE_LIST } from "../utils/config";
import type { Tcompany } from "../utils/global";

/**
 *
 * @param first_name
 * @param last_name
 * @param email
 * @param phone
 * @param password
 * @returns number: uid always > 0, false if error
 */
export const m_addStaff = async (
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    password: string,
    role: "manager" | "employee",
    address: string,
    suburb: string,
    city: string,
    state: string,
    country: string,
    postcode: string,
    dashboard: 0 | 1 | 2,
    clients: 0 | 1 | 2,
    orders: 0 | 1 | 2,
    calendar: 0 | 1 | 2,
    staff: 0 | 1 | 2,
    setting: 0 | 1 | 2
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.STAFF} (first_name, last_name, email, phone, password, role, address, suburb, city, state, country, postcode, dashboard, clients, orders, calendar, staff, setting) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                first_name,
                last_name,
                email,
                phone,
                password,
                role,
                address,
                suburb,
                city,
                state,
                country,
                postcode,
                dashboard,
                clients,
                orders,
                calendar,
                staff,
                setting,
            ]
        );
        console.log("-> insert result: ", result);
        connection.release();
        return result[0].insertId;
    } catch (err) {
        logger.errLog(err);
        return null;
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
            `SELECT * FROM ${DB_TABLE_LIST.STAFF} WHERE phone = ? OR email = ?`,
            [phone, email]
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
 * @param email
 * @returns {uid: number, password: string} | null
 */
export const m_searchMbyEmail = async (email: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT uid, password FROM ${DB_TABLE_LIST.STAFF} WHERE email = ?`,
            [email]
        );
        connection.release();
        return result[0][0];
    } catch (err) {
        console.log("-> search email error");
        logger.errLog(err);
        return null;
    }
};

/**
 *
 * @param uid staff's uid
 * @returns {dashboard: number, clients: number, orders: number, calendar: number, staff: number, setting: number} | null
 */
export const m_levelCheck = async (uid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT uid, first_name, last_name, role, access, dashboard, clients, orders, worklogs, calendar, staff, setting FROM ${DB_TABLE_LIST.STAFF} WHERE uid = '${uid}'`
        );
        connection.release();
        return result[0][0];
    } catch (err) {
        logger.errLog("level check rror: " + err);
        return null;
    }
};

/**
 *
 * @param email manager's email
 * @returns {uid: number, first_name: string, last_name: string, email: string, phone: string, address: string, created_date: string} | null
 */

export const m_checkEmail = async (email: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.STAFF} WHERE email = ?`,
            [email]
        );
        connection.release();
        return result;
    } catch (err) {
        logger.errLog(err);
        return null;
    }
};

export const m_getCompany = async () => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(`
            SELECT * FROM ${DB_TABLE_LIST.COMPANY}
        `);
        connection.release();
        //console.log("->get company result: ", result[0]);
        return result[0][0];
    } catch (error) {
        logger.errLog(error);
        return null;
    }
};

export const m_updateCompany = async (company: Tcompany) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `
            UPDATE ${DB_TABLE_LIST.COMPANY} SET name = ?, bld = ?, phone = ?, email = ?, address = ?, abn = ?, bsb = ?, acc = ? WHERE id = 1
        `,
            [
                company.name,
                company.bld,
                company.phone,
                company.email,
                company.address,
                company.abn,
                company.bsb,
                company.acc,
            ]
        );
        connection.release();
        return result[0];
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const m_insertCompany = async (company: Tcompany) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.COMPANY} (id, name, bld, phone, email, address, abn, bsb, acc) VALUES(?,?,?,?,?,?,?,?,?)`,
            [
                1,
                company.name,
                company.bld,
                company.phone,
                company.email,
                company.address,
                company.abn,
                company.bsb,
                company.acc,
            ]
        );
        connection.release();
        return result[0];
    } catch (error) {
        console.log(error);
        return null;
    }
};
