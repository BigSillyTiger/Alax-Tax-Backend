import type { Request, Response } from "express";
import { RES_STATUS, uidPrefix } from "../../utils/config";
import {
    m_orderDescInsert,
    m_orderInsert,
    m_clientOrders,
    m_clientOrderWichId,
    m_orderArchive,
    m_orderStatusUpdate,
    m_orderUpdatePayments,
    m_orderUpdateProperty,
    m_findClientID,
    m_findOrder,
    m_orderGetAllWithDetails,
    m_orderUpdateWithDesc,
    m_orderGetAllAbstract,
} from "../../models/ordersModel";
import {
    formatOrderArrangement,
    formatOrderDesc,
    formatPayment,
} from "../../libs/format";
import { genOID, genPID } from "../../libs/id";
import { genOrderWithWorkLogs } from "../../libs/format";
import { m_clientGetSingle } from "../../models/clientsModel";
import {
    m_wlGetAllAbstract,
    m_wlGetALLWithLogStructure,
} from "../../models/workLogModel";
import {
    Tarrangement,
    Torder,
    TorderAbstract,
    TorderArrangement,
    TRequestWithUser,
    TwlAbstract,
} from "../../utils/global";
import { promise } from "zod";

/**
 * @description return all orders from orders table with client first name and last name from clients table
 * @param req
 * @param res
 * @returns
 */
export const orderAll = async (req: Request, res: Response) => {
    console.log("server - order: get all orders");
    try {
        const ordersResult = await m_orderGetAllWithDetails();
        //const ordersResult = await m_wlGetAllOrdersWithWL();
        const workLogsResult = await m_wlGetALLWithLogStructure();

        const result = genOrderWithWorkLogs(
            ordersResult as Torder[],
            workLogsResult
        );

        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "successed retrieve all orders",
            data: result,
        });
    } catch (error) {
        console.log("ERROR: server - orderAll: get all orders");
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: "Failed: retrieve all orders",
            data: [],
        });
    }
};

export const orderWcid = async (req: Request, res: Response) => {
    console.log("server - order: get order with client id: ", req.body.cid);
    try {
        const result = await m_clientOrderWichId(req.body.cid);
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `successed retrieve client[${req.body.cid}] orders`,
                data: result,
            });
        } else {
            console.log(
                "ERROR: server - orderWcid: get order with client id: ",
                req.body
            );
            return res.status(400).json({
                status: RES_STATUS.FAILED,
                msg: `Failed: retrieve client[${req.body.cid}] orders`,
                data: null,
            });
        }
    } catch (error) {
        console.log(
            "ERROR: server - orderWcid: get order with client id: ",
            req.body
        );
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: `Failed: retrieve client[${req.body.cid}] orders`,
            data: null,
        });
    }
};

export const orderAdd = async (req: Request, res: Response) => {
    console.log("server - order: add order: ", req.body);
    const order = req.body.order;
    const order_services = req.body.order_services;
    const newOid = await genOID();
    console.log("==> new oid: ", newOid);
    order.oid = newOid;

    const orResult = await m_orderInsert(order);
    if (orResult.affectedRows) {
        const odResult = await m_orderDescInsert(
            formatOrderDesc(req.body.order.oid, order_services)
        );
        if (odResult?.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: "successed insert order",
                data: { order: orResult, order_services: odResult },
            });
        } else {
            throw new Error();
        }
    }
    return res.status(400).json({
        status: RES_STATUS.FAILED,
        msg: "Failed: insert order",
        data: null,
    });
};

export const orderDel = async (req: Request, res: Response) => {
    console.log("server - order: delete order: ", req.body);
    try {
        const result = await m_orderArchive(req.body.oid);
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUC_DEL,
                msg: `successed delete order[${req.body.oid}]`,
                data: result,
            });
        } else {
            throw new Error("error - delete order");
        }
    } catch (error) {
        console.log("ERROR: server - orderDel: delete order: ", req.body);
        return res.status(405).json({
            status: RES_STATUS.FAILED_DEL,
            msg: `Failed: delete order[${req.body.oid}]`,
            data: false,
        });
    }
};

export const orderUpdate = async (req: Request, res: Response) => {
    console.log("server - order: update order: ", req.body);
    const order = req.body.order;
    const order_services = req.body.order_services;
    try {
        const result = await m_orderUpdateWithDesc(
            order,
            order.oid,
            formatOrderDesc(req.body.order.oid, order_services)
        );
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `successed update order[${order.oid}]`,
                data: result,
            });
        } else {
            return res.status(400).json({
                status: RES_STATUS.FAILED,
                msg: `Failed: update order[${order.oid}]`,
                data: null,
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: `Failed: update order[${order.oid}]`,
            data: null,
        });
    }
};

/**
 * @description not used api
 * @param req
 * @param res
 * @returns
 */
export const clientOrders = async (req: Request, res: Response) => {
    console.log("server - order: get client orders: ", req.body.cid);
    const result = await m_clientOrders(req.body.cid);
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: `successed retrieve client[${req.body.cid}] all orders`,
            data: result,
        });
    } else {
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: `Failed: retrieve client[${req.body.cid}] orders`,
            data: null,
        });
    }
};

export const orderChangeStatus = async (req: Request, res: Response) => {
    console.log("server - order: change order status: ", req.body);
    try {
        const result = await m_orderStatusUpdate(req.body.oid, req.body.status);
        if (result.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_STATUS,
                msg: `successed change order[${req.body.oid}] status`,
                data: result,
            });
        } else {
            throw new Error("error - update order status");
        }
    } catch (error) {
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: `Failed: change order[${req.body.oid}]`,
            data: null,
        });
    }
};

export const orderUpdatePayments = async (req: Request, res: Response) => {
    console.log("server - order: update payments: ", req.body);
    const newPayments = await genPID(req.body.payments?.length).then((pids) =>
        formatPayment(pids, req.body.fk_oid, req.body.payments)
    );

    const result = await m_orderUpdatePayments(
        req.body.fk_oid,
        newPayments,
        req.body.paid
    );

    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUC_UPDATE_PAYMENTS,
            msg: `successed update payments[${req.body.fk_oid}] payments`,
            data: "",
        });
    }
    //}
    return res.status(400).json({
        status: RES_STATUS.FAILED,
        msg: `Failed: update order[${req.body.oid}] payments`,
        data: null,
    });
};

/**
 * @description not used api
 * @param req
 * @param res
 * @returns
 */
export const findClient = async (req: Request, res: Response) => {
    console.log("-> server - order: find client: ", req.body.oid);
    const clientID = await m_findClientID(req.body.oid);
    if (clientID && clientID.length) {
        const client = await m_clientGetSingle(clientID[0].cid);
        if (client) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `successed find client[${req.body.oid}]`,
                data: client,
            });
        }
    }
    return res.status(400).json({
        status: RES_STATUS.FAILED,
        msg: `Failed: find client[${req.body.oid}]`,
        data: null,
    });
};

/**
 * @description not used api
 * @param req
 * @param res
 * @returns
 */
export const findOrder = async (req: Request, res: Response) => {
    console.log("-> server - order: find order: ", req.body.oid);
    const order = await m_findOrder(req.body.oid);
    if (order) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: `successed find order[${req.body.oid}]`,
            data: order,
        });
    }
    return res.status(400).json({
        status: RES_STATUS.FAILED,
        msg: `Failed: find order[${req.body.oid}]`,
        data: null,
    });
};

export const updateInvoiceIssue = async (req: Request, res: Response) => {
    console.log("-> server - order: update invoice issue: ", req.body);
    const order = await m_orderUpdateProperty(
        "invoice_date",
        req.body.date,
        req.body.oid
    );
    if (order.affectedRows) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: `successed update invoice issue date[${req.body.oid}]`,
            data: order,
        });
    }
    return res.status(400).json({
        status: RES_STATUS.FAILED,
        msg: `Failed: update invoice issue date[${req.body.oid}]`,
        data: null,
    });
};

export const orderAllArrangement = async (
    req: TRequestWithUser,
    res: Response
) => {
    console.log("-> server - order: get all orders arrangement");
    const uid = req.user?.userId as string;
    const admin = req.user?.userId.charAt(0); // M - manager, E - employee
    try {
        const [orderAbstract, wlAbstract] = await Promise.all([
            m_orderGetAllAbstract().then((res) => res),
            m_wlGetAllAbstract().then((res) => res),
        ]);
        const newOrderArrangement = formatOrderArrangement(
            orderAbstract as TorderAbstract[],
            wlAbstract as TwlAbstract[]
        ).filter((oa: TorderArrangement) => {
            if (admin === uidPrefix.manager) return true;
            return oa.arrangement.some((a: Tarrangement) =>
                a.wl.some((w) => w.fk_uid === uid)
            );
        });

        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "successed retrieve all orders arrangement",
            data: newOrderArrangement,
        });
    } catch (error) {
        console.log(
            "ERROR: server - orderAllArrangement: get all orders arrangement"
        );
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: "Failed: retrieve all orders arrangement",
            data: [],
        });
    }
};
