import { DB_TABLE_LIST, uidPrefix } from "../utils/config";
import logger from "../libs/logger";
import adminPool from "../config/adminPool";
import { TnewStaff } from "../utils/global";
import { RowDataPacket } from "mysql2";

/**
 * @description retrieve all staff info which is not archived
 * @returns
 */
export const staff_all = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.STAFF} WHERE archive = 0`
        );
        connection.release();
        //console.log("-> all staff rows: ", rows);
        return rows as RowDataPacket[];
    } catch (err) {
        console.log("err: get all staff: ", err);
        return null;
    }
};

/**
 * @description retrieve staff info which is not archived with uid
 * @returns
 */
export const staff_getWithUid = async (uid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [rows] = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.STAFF} WHERE archive = 0 AND A.uid = ?`,
            [uid]
        );
        connection.release();
        //console.log("-> all staff rows: ", rows);
        return rows as RowDataPacket[];
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
export const staff_getSingle = async (uid: number) => {
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

export const staff_insert = async (staff: TnewStaff[]) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.STAFF} (uid, first_name, last_name, phone, email, password, address, role, access, suburb, city, state, country, postcode, dashboard, clients, orders, services, calendar, staff, setting, hr, bsb, account) VALUES (?)`,
            [staff]
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
export const staff_archiveSingle = async (uid: number) => {
    try {
        console.log("-> archieve uid: ", uid);
        const connection = await adminPool.getConnection();

        await connection.query(
            `UPDATE ${DB_TABLE_LIST.STAFF} SET phone = CONCAT('A', phone), email = CONCAT('A', email), archive = 1 WHERE uid = ? AND archive = 0`,
            [uid]
        );

        connection.release();
        return true;
    } catch (err) {
        console.log("err: archive single staff: ", err);
        return false;
    }
};

/**
 * @description delete single staff by uid
 * @param uid
 * @returns
 */
export const staff_deleteSingle = async (uid: number) => {
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
export const staff_updateProperty = async (
    uid: number,
    property: string,
    data: string | number
) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `UPDATE ${DB_TABLE_LIST.STAFF} SET ${property} = ? WHERE uid = ?`,
            [data, uid]
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (err) {
        console.log("err: update single staff property: ", err);
        return false;
    }
};

/**
 * @description update single staff all info
 * @param staff
 * @returns
 */
export const staff_update = async (staff: any, newUID?: string) => {
    try {
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.STAFF} SET uid = ?, first_name = ?, last_name = ?, phone = ?, email = ?, address = ?, role = ?, access = ?, suburb = ?, city = ?, state = ?, country = ?, postcode = ?, dashboard = ?, clients = ?, orders = ?, services = ?, calendar = ?, staff = ?, setting = ?, hr = ?, bsb = ?, account = ? WHERE uid = ?`,
            [
                staff.uid,
                staff.first_name,
                staff.last_name,
                staff.phone,
                staff.email,
                staff.address,
                staff.role,
                staff.access,
                staff.suburb,
                staff.city,
                staff.state,
                staff.country,
                staff.postcode,
                staff.dashboard,
                staff.clients,
                staff.orders,
                staff.services,
                staff.calendar,
                staff.staff,
                staff.setting,
                staff.hr,
                staff.bsb,
                staff.account,
                staff.uid,
            ]
        );
        if (newUID) {
            await connection.query(
                `UPDATE ${DB_TABLE_LIST.STAFF} SET uid = ? WHERE uid = ?`,
                [newUID, staff.uid]
            );
        }
        await connection.query("COMMIT;");
        connection.release();
        return true;
    } catch (err) {
        console.log("err: update single staff: ", err);
        return false;
    }
};

/**
 * @description check if staff property exist
 * @param uid
 * @param property
 * @param data
 * @returns
 */
export const staff_isPropertyExist = async (
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

export const staff_lastUid = async (
    prefix: (typeof uidPrefix)[keyof typeof uidPrefix]
) => {
    try {
        const connection = await adminPool.getConnection();
        /* const [result] = await connection.query(
            `SELECT uid FROM ${DB_TABLE_LIST.STAFF} WHERE uid LIKE '${prefix}%' AND archive = 0 ORDER BY uid DESC LIMIT 1`
        ); */
        const [result] = await connection.query(
            `SELECT uid FROM ${DB_TABLE_LIST.STAFF} WHERE uid LIKE '${prefix}%' ORDER BY uid DESC LIMIT 1`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (err) {
        logger.errLog(err);
        return null;
    }
};
