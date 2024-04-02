import { DB_TABLE_LIST, uidPrefix } from "../utils/config";
import logger from "../libs/logger";
import adminPool from "./adminPool";
import { TstaffData } from "../utils/global";

/**
 * @description retrieve all staff info which is not archived
 * @returns
 */
export const m_staffGetAll = async () => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.STAFF} WHERE archive = 0`
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: get all staff: ", err);
        return null;
    }
};

/**
 * @description retrieve single staff info which is not archived
 * @param uid
 * @returns
 */
export const m_staffGetSingle = async (uid: number) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.STAFF} WHERE uid = ? AND archive = 0`,
            [uid]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: get single staff: ", err);
        return null;
    }
};

export const m_staffInsert = async (staff: TstaffData) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.STAFF} (uid, first_name, last_name, phone, email, password, address, role, suburb, city, state, country, postcode, dashboard, clients, orders, calendar, staff, setting) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                staff.uid,
                staff.first_name,
                staff.last_name,
                staff.phone,
                staff.email,
                staff.password,
                staff.address,
                staff.role,
                staff.suburb,
                staff.city,
                staff.state,
                staff.country,
                staff.postcode,
                staff.dashboard,
                staff.clients,
                staff.orders,
                staff.calendar,
                staff.staff,
                staff.setting,
            ]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: insert staff: ", err);
        return null;
    }
};

/**
 * @description archive single staff by uid
 * @param uid
 * @returns
 */
export const m_staffArchiveSingle = async (uid: number) => {
    try {
        console.log("-> archieve uid: ", uid);
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.STAFF} SET archive = 1 WHERE uid = ?`,
            [uid]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: archive single staff: ", err);
        return null;
    }
};

/**
 * @description delete single staff by uid
 * @param uid
 * @returns
 */
export const m_staffDelSingle = async (uid: number) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.STAFF} WHERE uid = ?`,
            [uid]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: delete single staff: ", err);
        return null;
    }
};

/**
 * @description update single staff one specific property
 * @param uid - staff uid
 * @param property - the name of a property of staff
 * @param data - the new value of the property
 * @returns
 */
export const m_staffUpdateProperty = async (
    uid: number,
    property: string,
    data: string | number
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.STAFF} SET ${property} = ? WHERE uid = ?`,
            [data, uid]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: update single staff property: ", err);
        return null;
    }
};

/**
 * @description update single staff all info
 * @param staff
 * @returns
 */
export const m_staffUpdate = async (staff: any) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.STAFF} SET first_name = ?, last_name = ?, phone = ?, email = ?, address = ?, role = ?, suburb = ?, city = ?, state = ?, country = ?, postcode = ?, dashboard = ?, clients = ?, orders = ?, calendar = ?, staff = ?, setting = ? WHERE uid = ?`,
            [
                staff.first_name,
                staff.last_name,
                staff.phone,
                staff.email,
                staff.address,
                staff.role,
                staff.suburb,
                staff.city,
                staff.state,
                staff.country,
                staff.postcode,
                staff.dashboard,
                staff.clients,
                staff.orders,
                staff.calendar,
                staff.staff,
                staff.setting,
                staff.uid,
            ]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: update single staff: ", err);
        return null;
    }
};

/**
 * @description check if staff property exist
 * @param uid
 * @param property
 * @param data
 * @returns
 */
export const m_staffIsPropertyExist = async (
    uid: string,
    property: string,
    data: string | number
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.STAFF} WHERE ${property} = ? AND uid != ?`,
            [data, uid]
        );
        connection.release();
        return result[0].length > 0 ? true : false;
    } catch (err) {
        console.log("err: check staff property: ", err);
        return null;
    }
};

export const m_uidGetLastStaff = async (
    prefix: (typeof uidPrefix)[keyof typeof uidPrefix]
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT uid FROM ${DB_TABLE_LIST.STAFF} WHERE uid LIKE '${prefix}%' AND archive = 0 ORDER BY uid DESC LIMIT 1`
        );
        connection.release();
        return result[0];
    } catch (err) {
        logger.errLog(err);
        return null;
    }
};
