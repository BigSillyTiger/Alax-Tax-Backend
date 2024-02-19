import type { Request, Response } from "express";
import { RES_STATUS } from "../../utils/config";
import {
    m_orderDescInsert,
    m_orderGetAll,
    m_orderInsert,
    m_clientOrders,
    m_clientOrderWichId,
    m_orderArchive,
    m_orderStatusUpdate,
    m_orderUpdate,
    m_orderDescDel,
    m_deletePayment,
    m_updatePayments,
    m_orderUpdateProperty,
    m_findClientID,
    m_findOrder,
} from "../../models/ordersModel";
import { formOrderDesc, formPayment, genOrderId } from "../../utils/utils";
import { m_clientGetSingle } from "../../models/clientsModel";

/**
 * @description return all orders from orders table with client first name and last name from clients table
 * @param req
 * @param res
 * @returns
 */
export const orderAll = async (req: Request, res: Response) => {
    console.log("server - order: get all orders");
    const result = await m_orderGetAll();
    //console.log("-> all oreder from db: ", result);
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "successed retrieve all orders",
            data: result,
        });
    } else {
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: "Failed: retrieve all orders",
            data: null,
        });
    }
};

export const orderWcid = async (req: Request, res: Response) => {
    console.log(
        "server - order: get order with client id: ",
        req.body.client_id
    );
    const result = await m_clientOrderWichId(req.body.client_id);
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: `successed retrieve client[${req.body.client_id}] orders`,
            data: result,
        });
    } else {
        console.log(
            "ERROR: server - orderWcid: get order with client id: ",
            req.body
        );
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: `Failed: retrieve client[${req.body.client_id}] orders`,
            data: null,
        });
    }
};

export const orderAdd = async (req: Request, res: Response) => {
    console.log("server - order: add order: ", req.body);
    const order = req.body.order;
    const order_services = req.body.order_services;
    req.body.order.order_id = await genOrderId();
    const orResult = await m_orderInsert(order);
    if (orResult.affectedRows) {
        const odResult = await m_orderDescInsert(
            formOrderDesc(req.body.order.order_id, order_services)
        );
        if (odResult.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: "successed insert order",
                data: { order: orResult, order_services: odResult },
            });
        }
    }
    return res.status(400).json({
        status: RES_STATUS.FAILED,
        msg: "Failed: insert order",
        data: null,
    });
};

export const orderDel = async (req: Request, res: Response) => {
    console.log("server - order: delete order: ", req.body.order_id);
    const result = await m_orderArchive(req.body.order_id);
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUC_DEL,
            msg: `successed delete order[${req.body.order_id}]`,
            data: result,
        });
    } else {
        return res.status(400).json({
            status: RES_STATUS.FAILED_DEL,
            msg: `Failed: delete order[${req.body.order_id}]`,
            data: null,
        });
    }
};

export const orderUpdate = async (req: Request, res: Response) => {
    console.log("server - order: update order: ", req.body);
    const order = req.body.order;
    const order_services = req.body.order_services;
    const result = await m_orderUpdate(order);
    if (result.affectedRows) {
        // delete previous order_services
        const descDelRes = await m_orderDescDel(order.order_id);
        if (descDelRes.affectedRows) {
            const insertDescRes = await m_orderDescInsert(
                formOrderDesc(req.body.order.order_id, order_services)
            );
            if (insertDescRes.affectedRows) {
                return res.status(200).json({
                    status: RES_STATUS.SUC_UPDATE,
                    msg: `successed update order[${order.order_id}]`,
                    data: result,
                });
            }
        }
    }
    return res.status(400).json({
        status: RES_STATUS.FAILED,
        msg: `Failed: update order[${order.order_id}]`,
        data: null,
    });
};

export const clientOrders = async (req: Request, res: Response) => {
    console.log("server - order: get client orders: ", req.body.client_id);
    const result = await m_clientOrders(req.body.client_id);
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: `successed retrieve client[${req.body.client_id}] all orders`,
            data: result,
        });
    } else {
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: `Failed: retrieve client[${req.body.client_id}] orders`,
            data: null,
        });
    }
};

export const orderChangeStatus = async (req: Request, res: Response) => {
    console.log("server - order: change order status: ", req.body);
    const result = await m_orderStatusUpdate(
        req.body.order_id,
        req.body.status
    );
    if (result.affectedRows) {
        return res.status(200).json({
            status: RES_STATUS.SUC_UPDATE_STATUS,
            msg: `successed change order[${req.body.order_id}] status`,
            data: result,
        });
    } else {
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: `Failed: change order[${req.body.order_id}]`,
            data: null,
        });
    }
};

export const orderUpdatePayments = async (req: Request, res: Response) => {
    console.log("server - order: update payments: ", req.body);
    const delResult = await m_deletePayment(req.body.fk_order_id);
    //if (delResult.affectedRows) {
    const updatePayRes = await m_updatePayments(
        formPayment(req.body.fk_order_id, req.body.payments)
    );
    const updatePaidRes = await m_orderUpdateProperty(
        "order_paid",
        req.body.paid,
        req.body.fk_order_id
    );
    if (updatePayRes.affectedRows && updatePaidRes.affectedRows) {
        return res.status(200).json({
            status: RES_STATUS.SUC_UPDATE_PAYMENTS,
            msg: `successed update payments[${req.body.fk_order_id}] payments`,
            data: "",
        });
    }
    //}
    return res.status(400).json({
        status: RES_STATUS.FAILED,
        msg: `Failed: update order[${req.body.order_id}] payments`,
        data: null,
    });
};

export const findClient = async (req: Request, res: Response) => {
    console.log("-> server - order: find client: ", req.body.order_id);
    const clientID = await m_findClientID(req.body.order_id);
    if (clientID) {
        const client = await m_clientGetSingle(clientID);
        if (client) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `successed find client[${req.body.order_id}]`,
                data: client,
            });
        }
    }
    return res.status(400).json({
        status: RES_STATUS.FAILED,
        msg: `Failed: find client[${req.body.order_id}]`,
        data: null,
    });
};

export const findOrder = async (req: Request, res: Response) => {
    console.log("-> server - order: find order: ", req.body.order_id);
    const order = await m_findOrder(req.body.order_id);
    if (order) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: `successed find order[${req.body.order_id}]`,
            data: order,
        });
    }
    return res.status(400).json({
        status: RES_STATUS.FAILED,
        msg: `Failed: find order[${req.body.order_id}]`,
        data: null,
    });
};

export const updateInvoiceIssue = async (req: Request, res: Response) => {
    console.log("-> server - order: update invoice issue: ", req.body);
    const order = await m_orderUpdateProperty(
        "invoice_issue_date",
        req.body.date,
        req.body.order_id
    );
    if (order.affectedRows) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: `successed update invoice issue date[${req.body.order_id}]`,
            data: order,
        });
    }
    return res.status(400).json({
        status: RES_STATUS.FAILED,
        msg: `Failed: update invoice issue date[${req.body.order_id}]`,
        data: null,
    });
};
