import logger from "../libs/logger";
import adminPool from "../config/adminPool";
import { DB_TABLE_LIST } from "../utils/config";
import { TclientService, Tservice } from "../utils/global";
import { ResultSetHeader } from "mysql2";

export const service_all = async () => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.CLIENT_SERVICE}`
        );
        connection.release();
        return result as ResultSetHeader[];
    } catch (error) {
        console.log("-> error: service_all - ", error);
        return false;
    }
};

export const service_findByCid = async (cid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `SELECT * FROM ${DB_TABLE_LIST.CLIENT_SERVICE} WHERE fk_cid = ? AND deleted = ?`,
            [cid, 0]
        );
        connection.release();
        return result as ResultSetHeader[];
    } catch (error) {
        console.log("-> error - service_findByCid: ", error);
        return false;
    }
};

/**
 * @description only append oop / ctm service to client service table
 * @param csid
 * @param service
 * @returns
 */
export const service_append = async (service: any) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.CLIENT_SERVICE} ( csid, fk_cid, title, service_type, product_name, status, created_date, expiry_date, archive, note) VALUES ?`,
            [[service]]
        );
        connection.release();
        return result as ResultSetHeader;
    } catch (error) {
        console.log("-> error - service_append: ", error);
        return error;
    }
};

export const service_delete = async (csid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `UPDATE ${DB_TABLE_LIST.CLIENT_SERVICE} SET deleted = ? WHERE csid = ?`,
            [1, csid]
        );
        connection.release();
        return result as ResultSetHeader;
    } catch (error) {
        console.log("-> error - service_delete: ", error);
        return new Error("Error service_delete");
    }
};

/**
 * @description delete from client service table
 * @param csid
 * @returns
 */
export const service_clear = async (csid: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `DELETE FROM ${DB_TABLE_LIST.CLIENT_SERVICE} WHERE csid = ?`,
            [csid]
        );
        connection.release();
        return result as ResultSetHeader;
    } catch (error) {
        console.log("-> error - service_clear: ", error);
        return new Error("Error service_clear");
    }
};

export const service_updateStatus = async (csid: string, status: string) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `UPDATE ${DB_TABLE_LIST.CLIENT_SERVICE} SET status = ? WHERE csid = ?`,
            [status, csid]
        );
        connection.release();
        return result as ResultSetHeader;
    } catch (error) {
        console.log("-> error - service_updateStatus: ", error);
        return new Error("Error service_updateStatus");
    }
};

export const service_updateProperty = async (
    csid: string,
    property: string,
    value: string
) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `UPDATE ${DB_TABLE_LIST.CLIENT_SERVICE} SET ${property} = ? WHERE csid = ?`,
            [value, csid]
        );
        connection.release();
        return result as ResultSetHeader;
    } catch (error) {
        console.log("-> error - service_updateProperty: ", error);
        return new Error("Error service_updateProperty");
    }
};

export const service_update = async (service: TclientService) => {
    try {
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `UPDATE ${DB_TABLE_LIST.CLIENT_SERVICE} SET title = ?, service_type = ?, product_name = ?, status = ?, expiry_date = ?, archive = ?, note = ? WHERE csid = ?`,
            [
                service.title,
                service.service_type,
                service.product_name,
                service.status,
                service.expiry_date,
                service.archive,
                service.note,
                service.csid,
            ]
        );
        connection.release();
        return result as ResultSetHeader;
    } catch (error) {
        console.log("-> error - service_update: ", error);
        return new Error("Error service_update");
    }
};
