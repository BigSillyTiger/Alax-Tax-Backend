import {
    m_wlGetAll,
    m_wlUpdateAssignments,
    m_wlSingleUpdateHours,
    m_wlSingleArchive,
    m_wlGetToday,
    m_wlGetBHourWID,
    m_wlResume,
    m_wlPause,
    m_wlUpdateSTime,
    m_wlResetWorkTime,
    m_wlGetBTimeWID,
    m_wlUpdateEtime,
    m_wlSingleUpdate,
} from "../../models/workLogModel";
import type { Request, Response } from "express";
import type { TworkLog, ToriWorkLog } from "../../utils/global";
import { calBreakTime, genAUDate, genHHMM, genYYYYHHMM } from "../../libs/time";
import { formatDeduction, genWorkLogsWithNewWLID } from "../../libs/format";
import { formatWorkLog } from "../../libs/format";
import { RES_STATUS } from "../../utils/config";
import { genDID } from "../../libs/id";

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
            (value) => formatWorkLog(value)
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
        } else {
            throw new Error();
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

export const wlSingleUpdate = async (req: Request, res: Response) => {
    console.log("server - work log: single update hours and deduction");

    try {
        const newDeductions = await genDID(req.body.deduction.length).then(
            (dids) =>
                formatDeduction(
                    dids,
                    req.body.hourData.wlid,
                    req.body.deduction
                )
        );

        const result = await m_wlSingleUpdate(req.body.hourData, newDeductions);
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_WORKLOG,
                msg: "Success:  work log: single update hours and deduction",
                data: result,
            });
        }
    } catch (error) {
        console.log(
            "err: work log: single update hours and deduction: ",
            error
        );
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed: work log: single update hours and deduction",
            data: null,
        });
    }
};

export const wlSingleUpdateHours = async (req: Request, res: Response) => {
    console.log("server - work log: single update hours");
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
    const today = genYYYYHHMM(genAUDate());
    console.log(`server - work log: get today's[${today}] work logs`);
    try {
        const worklogsResult = await m_wlGetToday(today);
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

export const wlStartWorkTime = async (req: Request, res: Response) => {
    console.log("server - work log: start work, wlid: ", req.body.wlid);
    try {
        const s_time = genHHMM(genAUDate()) as string;
        const result = await m_wlUpdateSTime(req.body.wlid, s_time);
        if (result && result.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_WORKLOG,
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
                status: RES_STATUS.SUC_UPDATE_WORKLOG,
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

export const wlPauseWorkTime = async (req: Request, res: Response) => {
    console.log("server - work log: pause work time, wlid: ", req.body.wlid);
    try {
        const timeStr = genHHMM(genAUDate()) as string;
        const result = await m_wlPause(req.body.wlid, timeStr);
        if (result && result.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_WORKLOG,
                msg: `Success:  worklog[${req.body.wlid}] pause work time`,
                data: timeStr,
            });
        } else {
            throw new Error("Failed: work log: pause work time");
        }
    } catch (error) {
        console.log(
            "err: work log[",
            req.body.wlid,
            "] pause work time: ",
            error
        );
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed: work log: pause work time",
            data: null,
        });
    }
};

export const wlResumeWorkTime = async (req: Request, res: Response) => {
    console.log("server - work log: resume work time, wlid: ", req.body.wlid);
    try {
        const bTime2 = genHHMM(genAUDate()) as string;
        const time = await m_wlGetBTimeWID(req.body.wlid);
        console.log("-> bTime2: ", bTime2);
        const bTime1 = time ? time[0].b_time : "00:00";
        const bTime = calBreakTime(bTime1, bTime2);
        console.log("-> cal break time: ", bTime);

        const result = await m_wlResume(req.body.wlid, bTime as string);
        if (result && result.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_WORKLOG,
                msg: `Success:  worklog[${req.body.wlid}] resume work time`,
                data: 0,
            });
        } else {
            throw new Error("Failed: work log: resume work time");
        }
    } catch (error) {
        console.log(
            "err: work log[",
            req.body.wlid,
            "] resume work time: ",
            error
        );
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed: work log: resume work time",
            data: null,
        });
    }
};

export const wlStopWorkTime = async (req: Request, res: Response) => {
    console.log("server - work log: stop work time, wlid: ", req.body.wlid);
    try {
        const e_time = genHHMM(genAUDate()) as string;
        const result = await m_wlUpdateEtime(req.body.wlid, e_time);
        if (result && result.affectedRows) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_WORKLOG,
                msg: `Success:  worklog[${req.body.wlid}] stop work time`,
                data: result,
            });
        } else {
            throw new Error("Failed: work log: stop work time");
        }
    } catch (error) {
        console.log(
            "err: work log[",
            req.body.wlid,
            "] stop work time: ",
            error
        );
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed: work log: stop work time",
            data: null,
        });
    }
};
