import uuid from "uuid";
import type { Request, Response } from "express";
import { RES_STATUS } from "../../utils/config";
import {
    m_orderDescInsert,
    m_orderGetAll,
    m_orderInsert,
    m_clientOrders,
    m_clientOrderWichId,
    m_orderArchive,
    m_orderDel,
    m_orderStatusUpdate,
    m_orderUpdate,
    m_orderDescDel,
} from "../../models/ordersCtl";
import { formOrderDesc } from "../../utils/utils";

export const orderAll = async (req: Request, res: Response) => {
    console.log("server - order: get all orders");
    const result = await m_orderGetAll();
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
    const order_desc = req.body.order_desc;
    const orResult = await m_orderInsert(order);
    if (orResult.insertId) {
        const odResult = await m_orderDescInsert(
            formOrderDesc(orResult.insertId, order_desc)
        );
        if (odResult.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: "successed insert order",
                data: { order: orResult, order_desc: odResult },
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
    //const result = await m_orderDel(req.body.order_id);
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
    const order_desc = req.body.order_desc;
    const result = await m_orderUpdate(order);
    if (result.affectedRows) {
        // delete previous order_desc
        const descDelRes = await m_orderDescDel(order.order_id);
        if (descDelRes.affectedRows) {
            const insertDescRes = await m_orderDescInsert(
                formOrderDesc(req.body.order.order_id, order_desc)
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
