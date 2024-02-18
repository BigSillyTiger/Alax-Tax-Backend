import type { Request, Response } from "express";
import { RES_STATUS } from "../../utils/config";
import logger from "../../utils/logger";

import {
    m_clientGetAll,
    m_clientGetSingle,
    m_clientIsPropertyExist,
    m_clientInsert,
    m_clientDelSingle,
    m_clientUpdateProperty,
    m_clientUpdate,
    m_clientArchiveSingle,
} from "../../models/clientsModel";
import { genClientUid } from "../../utils/utils";

const phaseClientsData = async (items: any /* placeholder */) => {
    const client_id = await genClientUid();
    return items.map((item: any) => {
        const {
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
        } = item;
        return [
            client_id,
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
        ];
    });
};

/**
 *  @description insert multiple clients
 * @param req
 * @param res
 * @returns
 */
export const clientMulInstert = async (req: Request, res: Response) => {
    console.log("server - client: insert clients ");
    const insertData = await phaseClientsData(req.body);
    const insertResult = await m_clientInsert(insertData);
    if (insertResult.affectedRows) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "success: insert multiple clients",
            data: insertResult,
        });
    } else {
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: "Failed: insert multiple clients",
            data: null,
        });
    }
};

/**
 * @description retrieve all clients info
 * @param req
 * @param res
 * @returns
 */
export const clientGetAll = async (req: Request, res: Response) => {
    console.log("-> server - client: all");
    const clients = await m_clientGetAll();
    return res.status(200).json({
        status: RES_STATUS.SUCCESS,
        msg: clients?.length
            ? "successed retrieve all client"
            : "No client found",
        data: clients,
    });
};

/**
 * @description retrieve single client info
 * @param req
 * @param res
 * @returns
 */
export const clientInfo = async (req: Request, res: Response) => {
    console.log("-> server - client: info - ", req.body.client_id);
    const client = await m_clientGetSingle(req.body.client_id);
    if (client) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "successed retrieve client info",
            data: client,
        });
    } else {
        return res.status(403).json({
            status: RES_STATUS.FAILED,
            msg: "acquire client info failed",
            data: "",
        });
    }
};

export const clientSingleInstert = async (req: Request, res: Response) => {
    console.log("-> server - client: single insert: ", req.body[0]);

    const phoneDup = await m_clientIsPropertyExist(
        "0", // new client does not nedd to check client_id
        "phone",
        req.body[0].phone
    );
    const emailDup = await m_clientIsPropertyExist(
        "0", // new client does not nedd to check client_id
        "email",
        req.body[0].email
    );
    //console.log(`-> phoneDup: ${phoneDup}, emailDup: ${emailDup}`);

    if (!emailDup && !phoneDup) {
        const newClient = await phaseClientsData(req.body);
        const result = await m_clientInsert(newClient);

        if (result.affectedRows > 0) {
            logger.infoLog("client: successed in register a new client");
            return res.status(201).json({
                status: RES_STATUS.SUCCESS,
                msg: "new client created successfully",
                data: result,
            });
        }
    } else {
        let temp =
            phoneDup && !emailDup
                ? RES_STATUS.FAILED_DUP_PHONE
                : !phoneDup && emailDup
                ? RES_STATUS.FAILED_DUP_EMAIL
                : RES_STATUS.FAILED_DUP_P_E;
        console.log("-> insert duplicated: ", temp);

        return res.status(200).json({
            status: temp, // 401-phone existed, 402-email existed, 403-both existed
            msg: "error: accouont or phone or email conflict, or error occurs",
            data: "",
        });
    }
};

export const clientSingleDel = async (req: Request, res: Response) => {
    // Delete client
    console.log("-> server - client: delete clientID: ", req.body.client_id);

    //const result = await m_clientDelSingle(req.body.client_id);
    const result = await m_clientArchiveSingle(req.body.client_id);
    // Return success
    if (result.affectedRows > 0) {
        return res.status(200).json({
            status: RES_STATUS.SUC_DEL, // delete success
            msg: `Successed: delete client[id: ${req.body.client_id}]`,
            data: "",
        });
    } else {
        return res.status(403).json({
            status: RES_STATUS.FAILED_DEL,
            msg: `Failed: delete client[id: ${req.body.client_id}]`,
            data: "",
        });
    }
};

export const clientSingleArchive = async (req: Request, res: Response) => {
    console.log("-> server - client: archive");
    const result = await m_clientUpdateProperty(
        req.body.client_id,
        "archive",
        req.body.archive
    );
    if (result.affectedRows > 0) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: `Successed: archieve client[id: ${req.body.client_id}]`,
            data: "",
        });
    } else {
        return res.status(403).json({
            status: RES_STATUS.FAILED,
            msg: `Failed: archive client[id: ${req.body.client_id}]`,
            data: "",
        });
    }
};

// for update client in mysql clients table
export const clientSingleUpdate = async (req: Request, res: Response) => {
    console.log("-> server -client: update");
    const {
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
    } = req.body[0];
    const phoneDup = await m_clientIsPropertyExist(client_id, "phone", phone);
    const emailDup = await m_clientIsPropertyExist(client_id, "email", email);

    if (!phoneDup && !emailDup) {
        console.log("-> update not duplicated");
        const result = await m_clientUpdate(
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
            client_id
        );

        if (result?.affectedRows > 0) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `Successed: update client[id: ${client_id}]`,
                data: result,
            });
        }
        return res.status(403).json({
            status: RES_STATUS.FAILED,
            msg: `Failed: update client[id: ${client_id}]`,
            data: "",
        });
    } else {
        let temp =
            phoneDup && !emailDup
                ? RES_STATUS.FAILED_DUP_PHONE
                : !phoneDup && emailDup
                ? RES_STATUS.FAILED_DUP_EMAIL
                : RES_STATUS.FAILED_DUP_P_E;
        console.log("-> update duplicated: ", temp);

        //res.status(406).json({
        res.status(200).json({
            status: temp, // 401-phone existed, 402-email existed, 403-both existed
            msg: "Duplicated: phone or email",
            data: "",
        });
    }
};
