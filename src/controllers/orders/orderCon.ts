import uuid from "uuid";
import type { Request, Response } from "express";
import { RES_STATUS } from "../../utils/config";
import logger from "../../utils/logger";
import {
    m_orderDescInsert,
    m_orderGetAll,
    m_orderInsert,
} from "../../models/ordersCtl";

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

const formOrderDesc = (id: number, items: any) => {
    return items.map((item: any, index: number) => {
        const { description, qty, unit, unit_price, netto } = item;
        return [id, index, description, qty, unit, unit_price, netto];
    });
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
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "successed insert order",
            data: { order: orResult, order_desc: odResult },
        });
    } else {
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: "Failed: insert order",
            data: null,
        });
    }
};

export const orderDel = async (req: Request, res: Response) => {};

export const orderUpdate = async (req: Request, res: Response) => {};
