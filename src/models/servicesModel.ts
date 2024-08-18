import logger from "../libs/logger";
import adminPool from "../config/adminPool";
import { DB_TABLE_LIST } from "../utils/config";
import { Tservice } from "@/utils/global";
import { ResultSetHeader } from "mysql2";

export const service_append = async (csid: string, service: Tservice[]) => {
    try {
        console.log("-> appending new client service: ", service);
        const connection = await adminPool.getConnection();
        const [result] = await connection.query(
            `
            INSERT INTO ${DB_TABLE_LIST.CLIENT_SERVICE} ( csid, fk_cid, title, service_type, product_name, status, created_date, expiry_date, archive, deleted, note )`,
            [[csid, ...service]]
        );
        connection.release();
        return result as ResultSetHeader;
    } catch (error) {
        console.log("-> error - service_append: ", error);
        return new Error("Error service_append");
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
