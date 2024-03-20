import {
    m_wlGetAll,
    m_wlUpdateAssignments,
    m_wlSingleUpdateHours,
    m_wlSingleArchive,
    m_wlGetToday,
    m_wlGetBTimeWID,
    m_wlUpdateBTime,
    m_wlStartWork,
    m_wlResetWorkTime,
} from "../../models/workLogModel";
import type { Request, Response } from "express";
import type { TworkLog, ToriWorkLog } from "../../utils/global";
import {
    calBreakTime,
    formWorkLog,
    genHHMM,
    genWorkLogsWithNewWLID,
    startBreakTimer,
    stopBreakTimer,
} from "../../utils/utils";
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

export const wlSingleDel = async (req: Request, res: Response) => {
    console.log("server - work log: single delete");
    try {
        const result = await m_wlSingleArchive(req.body.wlid);
        console.log("-> delete result: ", result);
        if (result?.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUC_DELETE_WORKLOG,
                msg: "Success:  work log: single delete",
                data: result,
            });
        } else {
            throw new Error("Failed: work log: single delete");
        }
    } catch (error) {
        console.log("err: work log: single delete: ", error);
        return res.status(400).json({
            status: RES_STATUS.FAILED_DELETE_WORKLOG,
            msg: "Failed: work log: single delete",
            data: null,
        });
    }
};

export const wlGetToday = async (req: Request, res: Response) => {
    const today = new Date().toISOString().split("T")[0];
    console.log(`server - work log: get today's[${today}] work logs`);
    try {
        const worklogsResult = await m_wlGetToday(today);
        //console.log("-> today result: ", worklogsResult);
        if (worklogsResult && worklogsResult.length) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `successed retrieve today's[${today}] work logs`,
                data: worklogsResult,
            });
        } else {
            return res.status(400).json({
                status: RES_STATUS.FAILED,
                msg: `Failed: retrieve today's[${today}] work logs`,
                data: null,
            });
        }
    } catch (error) {
        console.log("err: work log: get today's work logs: ", error);
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: "Failed: get today's work logs",
            data: null,
        });
    }
};

export const wlStartWork = async (req: Request, res: Response) => {
    console.log("server - work log: start work, wlid: ", req.body.wlid);
    try {
        const time = new Date();
        const s_time = genHHMM(time.getHours(), time.getMinutes());

        const result = await m_wlStartWork(s_time, req.body.wlid);
        if (result && result.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `Success:  worklog[${req.body.wlid}] start work`,
                data: result,
            });
        } else {
            throw new Error("Failed: work log: start work");
        }
    } catch (error) {
        console.log("err: work log[", req.body.wlid, "] start work: ", error);
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed: work log: start work",
            data: null,
        });
    }
};

export const wlResetWorkTime = async (req: Request, res: Response) => {
    console.log("server - work log: reset work time, wlid: ", req.body.wlid);
    try {
        const result = await m_wlResetWorkTime(req.body.wlid);
        if (result && result.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `Success:  worklog[${req.body.wlid}] reset work time`,
                data: result,
            });
        } else {
            throw new Error("Failed: work log: reset work time");
        }
    } catch (error) {
        console.log(
            "err: work log[",
            req.body.wlid,
            "] reset work time: ",
            error
        );
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed: work log: reset work time",
            data: null,
        });
    }
};

export const wlBreakStart = async (req: Request, res: Response) => {
    console.log("server - work log: break start, wlid: ", req.body.wlid);
    try {
        const result = startBreakTimer(req.body.wlid);
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `Success:  worklog[${req.body.wlid}] break start`,
                data: result,
            });
        } else {
            throw new Error("Failed: work log: break start");
        }
    } catch (error) {
        console.log("err: work log[", req.body.wlid, "] break start: ", error);
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed: work log: break start",
            data: null,
        });
    }
};

export const wlBreakEnd = async (req: Request, res: Response) => {
    console.log("server - work log: break end, wlid: ", req.body.wlid);
    try {
        const breakTime = stopBreakTimer(req.body.wlid);
        const currentBreakTime = await m_wlGetBTimeWID(req.body.wlid);
        console.log("-> break time: ", breakTime, currentBreakTime);

        const newBreakTime = calBreakTime(
            breakTime,
            currentBreakTime[0] as string
        );
        const result = await m_wlUpdateBTime(req.body.wlid, newBreakTime);
        if (result?.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_WORKLOG,
                msg: `Success:  worklog[${req.body.wlid}] break end`,
                data: null,
            });
        } else {
            throw new Error("Failed: work log: break end");
        }
    } catch (error) {
        console.log("err: work log[", req.body.wlid, "] break end: ", error);
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed: work log: break end",
            data: null,
        });
    }
};
