import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { ALAX_DB_CONFIG } from "../utils/config";
import logger from "../utils/logger";

const sqlFilePath = path.join(__dirname, "", "Alax_Tax_Database.sql");
const sql = fs.readFileSync(sqlFilePath, "utf8");

const createConnection = async () => {
    try {
        const connection = await mysql.createConnection(ALAX_DB_CONFIG);
        logger.infoLog("connection created succeed");
        return connection;
    } catch (err) {
        logger.errLog("connected err: " + err);
        throw err;
    }
};

const connectDB = async () => {
    try {
        const connection = await createConnection();
        await connection.execute(sql);
        //logger.infoLog("db connected successfully~");
    } catch (err) {
        logger.errLog(err);
    }
};

export { createConnection, connectDB };
