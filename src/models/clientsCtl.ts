import { DB_TABLE_LIST } from "../utils/config";
import logger from "../utils/logger";
import adminPool from "./adminPool";

type TclientData = {
    client_id: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address: string;
    suburb: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
}[];

export const m_clientInsert = async (client: TclientData) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.CLIENTS} (client_id, first_name, last_name, phone, email, address, suburb, city, state, country, postcode) VALUES ?`,
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
            `SELECT * FROM ${DB_TABLE_LIST.CLIENTS} WHERE archive = 0 ORDER BY created_date DESC`
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: get all clients: ", err);
        return null;
    }
};

export const m_clientGetSingle = async (client_id: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.CLIENTS} WHERE client_id = ? AND archive = 0`,
            [client_id]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: get single client: ", err);
        return null;
    }
};

export const m_clientIsPropertyExist = async (
    client_id: string,
    property: string,
    data: string | number
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT ${property} FROM ${DB_TABLE_LIST.CLIENTS} WHERE ${property} = ? AND client_id != ?`,
            [data, client_id]
        );
        connection.release();
        return result[0].length > 0 ? true : false;
    } catch (err) {
        console.log("err: check if client property exist: ", err);
        return null;
    }
};

export const m_clientDelSingle = async (client_id: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.CLIENTS} WHERE client_id = ?`,
            [client_id]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: delete single client: ", err);
        return null;
    }
};

export const m_clientArchiveSingle = async (client_id: string) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.CLIENTS} SET archive = ? WHERE client_id = ?`,
            [1, client_id]
        );
        connection.release();
        console.log("-> archive client result: ", result);
        return result[0];
    } catch (err) {
        console.log("err: archive client: ", err);
        return null;
    }
};

export const m_clientUpdateProperty = async (
    client_id: string,
    property: string,
    data: string | number
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.CLIENTS} SET ${property} = ? WHERE client_id = ?`,
            [data, client_id]
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
    client_id: string
) => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `UPDATE ${DB_TABLE_LIST.CLIENTS} SET first_name = ?, last_name = ?, phone = ?, email = ?, address = ?, suburb = ?, city = ?, state = ?, country = ?, postcode = ? WHERE client_id = ?`,
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
                client_id,
            ]
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: update client: ", err);
        return null;
    }
};

export const m_uidGetLastClient = async () => {
    try {
        const connection = await adminPool.getConnection();
        const result: any = await connection.query(
            `SELECT client_id FROM ${DB_TABLE_LIST.CLIENTS} ORDER BY client_id DESC LIMIT 1`
        );
        connection.release();
        return result[0];
    } catch (err) {
        console.log("err: get last client uid: ", err);
        return null;
    }
};
