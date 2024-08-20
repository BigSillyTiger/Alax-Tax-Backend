import type { Request, Response } from "express";
import { RES_STATUS, uidPrefix } from "../../utils/config";
import { service_findByCid } from "../../models/servicesModel";

export const servicesAll = async (req: Request, res: Response) => {};

export const servicesWClient = async (req: Request, res: Response) => {
    console.log("server - servicesWClient: ", req.body.cid);
    try {
        const result = await service_findByCid(req.body.cid);
        console.log("---> the client sercies are: ", result);
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `Success: retrieve client[${req.body.cid}] services`,
                data: result,
            });
        }
    } catch (error) {
        console.log(
            "ERROR: server - servicesWClient: get services with cid: ",
            req.body.cid
        );
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: `Failed: retrieve client[${req.body.cid}] services`,
            data: null,
        });
    }
};
