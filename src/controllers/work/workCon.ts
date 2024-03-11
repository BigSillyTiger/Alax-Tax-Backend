import { m_wlUpdateAssignments } from "../../models/workLogModel";
import type { Request, Response } from "express";
import type { TworkLog, ToriWorkLog } from "../../utils/global";

export const workAdd = async (req: Request, res: Response) => {};

export const workUpdate = async (req: Request, res: Response) => {
    console.log("server - work assignment update: ", req.body);
    const newWorkLogs = req.body.workLogs.flatMap((wl: TworkLog) =>
        wl.assigned_work.map(
            ({ first_name, last_name, phone, email, role, ...rest }) => rest
        )
    ) as ToriWorkLog[];
    console.log("-> newWorkLogs: ", newWorkLogs);
    try {
        //const result = await m_wlUpdateAssignments(req.body);
        if (1) {
            return res.status(200).json({
                status: "success",
                msg: "Success:  work assignment update",
                data: "",
            });
        }
    } catch (err) {
        console.log("err: work assignment update: ", err);
        return res.status(400).json({
            status: "failed",
            msg: "Failed: work assignment update",
            data: null,
        });
    }
};
