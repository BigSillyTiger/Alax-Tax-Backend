import {
    m_wlGetAll,
    m_wlUpdateAssignments,
    m_wlSingleUpdateHours,
} from "../../models/workLogModel";
import type { Request, Response } from "express";
import type { TworkLog, ToriWorkLog } from "../../utils/global";
import { formWorkLog, genWorkLogsWithNewWLID } from "../../utils/utils";
import { RES_STATUS } from "../../utils/config";

export const wlAll = async (req: Request, res: Response) => {
    console.log("server - work log: get all work logs");
    try {
        const worklogsResult = await m_wlGetAll();
        if (worklogsResult && worklogsResult.length) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: "successed retrieve all work logs",
                data: worklogsResult,
            });
        } else {
            return res.status(400).json({
                status: RES_STATUS.FAILED,
                msg: "Failed: retrieve all work logs",
                data: null,
            });
        }
    } catch (error) {}
};

export const wlUpdate = async (req: Request, res: Response) => {
    console.log("server - work assignment update ");
    try {
        const tempWorkLogs = req.body.workLogs
            .filter((wl: TworkLog) => wl.assigned_work.length > 0)
            .flatMap((wl: TworkLog) =>
                wl.assigned_work.map(
                    ({ first_name, last_name, phone, email, role, ...rest }) =>
                        rest
                )
            ) as ToriWorkLog[];
        const newWorkLogs = await genWorkLogsWithNewWLID(tempWorkLogs).then(
            (value) => formWorkLog(value)
        );
        //const newWorkLogs = genWorkLogsWithNewWLID(tempWorkLogs);
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
    } catch (error) {
        console.log("err: work assignment update: ", error);
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed: work assignment update",
            data: null,
        });
    }
};

export const wlSingleUpdateHours = async (req: Request, res: Response) => {
    console.log("server - work log: single update");
    try {
        console.log("-> work log time info: ", req.body);
        const result = await m_wlSingleUpdateHours(req.body);
        console.log("-> update result: ", result);
        if (result?.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_WORKLOG,
                msg: "Success:  work log: single update",
                data: result,
            });
        } else {
            throw new Error("Failed: work log: single update");
        }
    } catch (error) {
        console.log("err: work log: single update: ", error);
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed: work log: single update",
            data: null,
        });
    }
};
