import uuid from "uuid";
import bcrypt from "bcrypt";
import mysql, { Connection, createConnection } from "mysql2/promise";
import logger from "../../utils/logger";
import { ALAX_DB_CONFIG, DB_TABLE_LIST } from "../../utils/config";
import { Request, Response } from "express";

interface userType {
    first_name: string;
    surname: string;
    account: string;
    password: string;
    phone: string;
    email: string;
}

const pool = mysql.createPool({ ...ALAX_DB_CONFIG, connectionLimit: 5 });

const formDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding leading zero if needed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatNewUser = async ({
    first_name,
    surname,
    account,
    password,
    phone,
    email,
}: userType) => {
    const hashedPW = await bcrypt.hash(password, 10);
    const date = formDate();
    console.log("test: ", [
        first_name,
        surname,
        account,
        hashedPW,
        phone,
        email,
        date,
    ]);
    return [first_name, surname, account, hashedPW, phone, email, date];
};

const register = async (req: Request, res: Response) => {
    logger.infoLog("server - register");
    console.log(11111);
    console.log(req.body);
    try {
        const newUser = await formatNewUser(req.body);

        const connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO ${DB_TABLE_LIST.MANAGER} (first_name, surname, account, password, phone, email, created_date) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
            newUser
        );
        connection.release();
        res.status(201).json({ msg: "new user register successfully" });
    } catch (err) {
        logger.errLog(err);
        res.status(500).json({ msg: "Internet Server Error" });
    }
};

export { register };
