import type { Request, Response } from "express";
import { RES_STATUS, SERVICE_TYPE } from "../../utils/config";
import {
    order_serviceInsert,
    order_insert,
    order_clientOrders,
    order_clientDetailedOrders,
    order_archive,
    order_updateStatus,
    order_updatePayment,
    order_updateProperty,
    order_findCid,
    order_findOrder,
    order_getAllWithDetails,
    order_updateWithService,
    order_getAllAbstract,
    order_delete,
    order_updateServiceStatus,
    order_findService,
    order_clientOrderService,
} from "../../models/ordersModel";
import {
    formatClientService,
    formatOrderService,
    formatPayment,
} from "../../libs/format";
import { genOID, genOSID, genPID } from "../../libs/id";
import { client_getSingle } from "../../models/clientsModel";
import { TclientorderWithId, Tservice } from "../../utils/global";
import { findEmptyOsid, osStatusMap } from "../../libs/utils";

/**
 * @description return all orders from orders table with client first name and last name from clients table
 * @param req
 * @param res
 * @returns
 */
export const orderAll = async (req: Request, res: Response) => {
    console.log("server - order: get all orders");
    try {
        const ordersResult = await order_getAllWithDetails();
        //const ordersResult = await m_wlGetAllOrdersWithWL();

        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "successed retrieve all orders",
            data: ordersResult,
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

export const orderWithCid = async (req: Request, res: Response) => {
    console.log("server - order: get order with client id: ", req.body.cid);
    try {
        const result = (await order_clientDetailedOrders(
            req.body.cid
        )) as TclientorderWithId[];
        //console.log("--> client order with id - result: ", result);
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `successed retrieve client[${req.body.cid}] orders`,
                data: result,
            });
        } else {
            console.log(
                "ERROR: server - orderWithCid: get order with client id: ",
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
            "ERROR: server - orderWithCid: get order with client id: ",
            req.body.cid
        );
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: `Failed: retrieve client[${req.body.cid}] orders`,
            data: null,
        });
    }
};

/**
 * @description return order service of client with client id
 * @param req
 * @param res
 */
export const orderServiceWithCid = async (req: Request, res: Response) => {
    console.log(
        "server - order: get order service with client id: ",
        req.body.cid
    );
    try {
        const result = (await order_clientOrderService(
            req.body.cid
        )) as Tservice[];
        if (result) {
            console.log(
                "---> client[" + req.body.cid + "] order services: ",
                result
            );
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `successed retrieve client[${req.body.cid}] order services`,
                data: result,
            });
        } else {
            throw new Error("error - orderServiceWithCid");
        }
    } catch (error) {
        console.log(
            "ERROR: server - orderServiceWithCid: get order service with client id: ",
            req.body.cid
        );
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: `Failed: retrieve client[${req.body.cid}] order services`,
            data: null,
        });
    }
};

/**
 * @description add new order to order_list table
 * @param req
 * @param res
 * @returns
 */
export const orderAdd = async (req: Request, res: Response) => {
    console.log("server - order: add order: ", req.body);
    try {
        const order = req.body.order;
        const order_services = req.body.order_services;
        const newOsidNum = findEmptyOsid(order_services).length;
        const newOid = await genOID();
        order.oid = newOid;

        const orResult = await order_insert(order);
        if (orResult.affectedRows) {
            const osidArray = await genOSID(newOsidNum);
            if (osidArray === null) throw new Error("error - genOSID");
            const odResult = await order_serviceInsert(
                formatOrderService(
                    req.body.order.oid,
                    order_services,
                    osidArray as string[]
                )
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
    } catch (error) {
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: "Failed: insert order",
            data: null,
        });
    }
};

export const orderDel = async (req: Request, res: Response) => {
    console.log("server - order: delete order: ", req.body);
    try {
        const result = await order_delete(req.body.oid);
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
        const newOsidNum = findEmptyOsid(order_services).length;
        const osidArray = await genOSID(newOsidNum);
        if (osidArray === null) throw new Error("error - genOSID");
        const newFormateServices = formatOrderService(
            req.body.order.fk_cid,
            order_services,
            osidArray
        );

        const result = await order_updateWithService(
            order,
            order.oid,
            newFormateServices
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
    const result = await order_clientOrders(req.body.cid);
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

/**
 * @description change order status and change order_service status
 *              and update client service table
 *              not used
 * @param req
 * @param res
 * @returns
 */
export const orderChangeStatus = async (req: Request, res: Response) => {
    console.log("server - order: change order status: ", req.body);
    try {
        // update order status
        const result1 = await order_updateStatus(req.body.oid, req.body.status);
        // update order service status
        const result2 = await order_updateServiceStatus(
            req.body.oid,
            req.body.status
        );

        if (result1.affectedRows && result2.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_STATUS,
                msg: `successed change order[${req.body.oid}] status`,
                data: result1,
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

    const result = await order_updatePayment(
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
    const clientID = await order_findCid(req.body.oid);
    console.log("---> test cid: ", clientID);
    if (clientID && clientID.length) {
        const client = await client_getSingle(clientID[0].cid);
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
    const order = await order_findOrder(req.body.oid);
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
    const order = await order_updateProperty(
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
