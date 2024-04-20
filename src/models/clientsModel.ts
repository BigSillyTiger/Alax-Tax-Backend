import { DB_TABLE_LIST } from "../utils/config";
import logger from "../libs/logger";
import adminPool from "./adminPool";
import type { TclientData } from "../utils/global";
import { RowDataPacket } from "mysql2";

export const m_clientInsert = async (client: TclientData) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.CLIENT} (cid, first_name, last_name, phone, email, address, suburb, city, state, country, postcode) VALUES ?`,
            [client]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: insert client: ", err);
        return null;
    }
};

export const m_clientGetAll = async () => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.CLIENT} WHERE archive = 0 ORDER BY created_date DESC`
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: get all clients: ", err);
        return null;
    }
};

export const m_clientGetSingle = async (cid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.CLIENT} WHERE cid = ? AND archive = 0`,
            [cid]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: get single client: ", err);
        return null;
    }
};

export const m_clientIsPropertyExist = async (
    cid: string,
    property: string,
    data: string | number
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT ${property} FROM ${DB_TABLE_LIST.CLIENT} WHERE ${property} = ? AND cid != ? AND archive = 0`,
            [data, cid]
        );
        connection.release();
        return result[0].length > 0 ? true : false;
    } catch (err) {
        console.log("err: check if client property exist: ", err);
        return null;
    }
};

export const m_clientDelSingle = async (cid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.CLIENT} WHERE cid = ?`,
            [cid]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: delete single client: ", err);
        return null;
    }
};

export const m_clientArchiveSingle = async (cid: string) => {
    try {
        const connection = await adminPool.getConnection();
        await connection.query("START TRANSACTION;");
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.CLIENT} SET archive = ? WHERE cid = ?`,
            [1, cid]
        );
        await connection.query(
            `UPDATE ${DB_TABLE_LIST.CLIENT} SET phone = CONCAT('A', phone), email = CONCAT('A', email) WHERE cid = ? AND archive = 1`,
            [cid]
        );
        await connection.query("COMMIT;");
        connection.release();
        return true;
    } catch (err) {
        console.log("err: archive client: ", err);
        return false;
    }
};

export const m_clientUpdateProperty = async (
    cid: string,
    property: string,
    data: string | number
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.CLIENT} SET ${property} = ? WHERE cid = ?`,
            [data, cid]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: update client property: ", err);
        return null;
    }
};

export const m_clientUpdate = async (
    first_name: string,
    last_name: string,
    phone: string,
    email: string,
    address: string,
    suburb: string,
    city: string,
    state: string,
    country: string,
    postcode: string,
    cid: string
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.CLIENT} SET first_name = ?, last_name = ?, phone = ?, email = ?, address = ?, suburb = ?, city = ?, state = ?, country = ?, postcode = ? WHERE cid = ?`,
            [
                first_name,
                last_name,
                phone,
                email,
                address,
                suburb,
                city,
                state,
                country,
                postcode,
                cid,
            ]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: update client: ", err);
        return null;
    }
};

export const m_clientsLastCID = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT cid FROM ${DB_TABLE_LIST.CLIENT} ORDER BY cid DESC LIMIT 1`
        );
        connection.release();
        return result as RowDataPacket[];
    } catch (err) {
        console.log("err: get last client uid: ", err);
        return null;
    }
};
