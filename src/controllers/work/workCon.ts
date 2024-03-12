import { m_wlUpdateAssignments } from "../../models/workLogModel";
import type { Request, Response } from "express";
import type { TworkLog, ToriWorkLog } from "../../utils/global";
import { formWorkLog, genWorkLogsWithNewWLID } from "../../utils/utils";
import { RES_STATUS } from "../../utils/config";

export const workAdd = async (req: Request, res: Response) => {};

export const workUpdate = async (req: Request, res: Response) => {
    console.log("server - work assignment update ");
    const tempWorkLogs = req.body.workLogs
        .filter((wl: TworkLog) => wl.assigned_work.length > 0)
        .flatMap((wl: TworkLog) =>
            wl.assigned_work.map(
                ({ first_name, last_name, phone, email, role, ...rest }) => rest
            )
        ) as ToriWorkLog[];
    const newWorkLogs = await genWorkLogsWithNewWLID(tempWorkLogs).then(
        (value) => formWorkLog(value)
    );
    //const newWorkLogs = genWorkLogsWithNewWLID(tempWorkLogs);
    try {
        const oid = req.body.workLogs[0].fk_oid;
        //const result = true;
        const result = await m_wlUpdateAssignments(oid, newWorkLogs);
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_WORKLOG,
                msg: "Success:  work assignment update",
                data: result,
            });
        }
    } catch (err) {
        console.log("err: work assignment update: ", err);
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed: work assignment update",
            data: null,
        });
    }
};
