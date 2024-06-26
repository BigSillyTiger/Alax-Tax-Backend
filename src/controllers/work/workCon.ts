import {
    m_wlGetAllWDeduct,
    m_wlUpdateAssignments,
    m_wlSingleUpdateHours,
    m_wlSingleArchive,
    m_wlGetTheDay,
    m_wlGetBHourWID,
    m_wlResume,
    m_wlPause,
    m_wlUpdateSTime,
    m_wlResetWorkTime,
    m_wlGetBTimeWID,
    m_wlUpdateEtime,
    m_wlSingleUpdateHND,
    m_wlSingleUpdateDeduction,
    m_wlUpdateStatus,
    m_wlGetEmployeeWL,
    m_wlGetEmployeeTheDay,
    m_wlUpdateBhour,
} from "../../models/workLogModel";
import type { Request, Response } from "express";
import type {
    TwlUnion,
    ToriWorkLog,
    TRequestWithUser,
} from "../../utils/global";
import {
    addBreakTime,
    calBreakTime,
    genAUDate,
    genHHMM,
    genYYYYHHMM,
} from "../../libs/time";
import { formatDeduction, genWorkLogsWithNewWLID } from "../../libs/format";
import { formatWorkLog } from "../../libs/format";
import { RES_STATUS, uidPrefix } from "../../utils/config";
import { genDID } from "../../libs/id";

export const wlAll = async (req: TRequestWithUser, res: Response) => {
    console.log("server - work log: get all work logs");
    const uid = req.user?.userId as string;
    const admin = req.user?.userId.charAt(0); // M - manager, E - employee
    try {
        let worklogsResult;
        if (admin === uidPrefix.manager) {
            worklogsResult = await m_wlGetAllWDeduct();
        } else {
            worklogsResult = await m_wlGetEmployeeWL(uid);
        }

        if (worklogsResult && worklogsResult.length) {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `successed retrieve all work logs[${uid}]`,
                data: worklogsResult,
            });
        } else {
            return res.status(200).json({
                status: RES_STATUS.SUCCESS,
                msg: `successed retrieve all work logs[${uid}] - 0`,
                data: [],
            });
        }
    } catch (error) {
        console.log("err: work log: get all work logs: ", error);
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: "Failed: get all work logs",
            data: [],
        });
    }
};

export const wlUpdate = async (req: Request, res: Response) => {
    console.log("server - work assignment update ");
    try {
        const tempWorkLogs = req.body.workLogs
            .filter((wl: TwlUnion) => wl.assigned_work.length > 0)
            .flatMap((wl: TwlUnion) =>
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

export const wlSingleUpdateHND = async (
    req: TRequestWithUser,
    res: Response
) => {
    console.log("server - work log: single update hours, note and deduction");
    try {
        //const uid = req.user?.userId as string;
        const isManager = req.user?.userId.charAt(0) === uidPrefix.manager; // M - manager, E - employee
        const newDeductions =
            req.body.deduction !== "skip"
                ? await genDID(req.body.deduction.length).then((dids) =>
                      formatDeduction(dids, req.body.wlid, req.body.deduction)
                  )
                : "skip";

        const result = await m_wlSingleUpdateHND(
            req.body.wlid, // string
            req.body.hourData, // {s_time, e_time, b_time, b_hour} | "skip"
            req.body.note, // string | "skip"
            newDeductions, // {did, fk_wlid, amount, note}[] | "skip"
            isManager ? "confirmed" : "processing"
        );
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_WORKLOG,
                msg: "Success:  work log: single update hours, note and deduction",
                data: result,
            });
        }
    } catch (error) {
        console.log(
            "err: work log: single update hours, note and deduction: ",
            error
        );
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed: work log: single update hours, note and deduction",
            data: null,
        });
    }
};

export const wlSingleUpdateDeduction = async (req: Request, res: Response) => {
    console.log("server - work log: single update deduction ");
    try {
        const newDeductions = await genDID(req.body.deduction.length).then(
            (dids) => formatDeduction(dids, req.body.wlid, req.body.deduction)
        );

        const result = await m_wlSingleUpdateDeduction(
            req.body.wlid,
            newDeductions
        );
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_WORKLOG,
                msg: "Success - work log: single update deduction",
                data: result,
            });
        }
    } catch (error) {
        console.log("err - work log: single update deduction: ", error);
        return res.status(400).json({
            status: RES_STATUS.FAILED_UPDATE_WORKLOG,
            msg: "Failed - work log: single update deduction",
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

export const wlChangeStatus = async (req: Request, res: Response) => {
    console.log("server - work log: single update status");
    try {
        const result = await m_wlUpdateStatus(req.body.wlid, req.body.status);
        if (result) {
            return res.status(200).json({
                status: RES_STATUS.SUC_UPDATE_WORKLOG,
                msg: "Success:  work log: single update status",
                data: result,
            });
        } else {
            throw new Error("Failed - work log: update status");
        }
    } catch (error) {
        console.log("err: work log: single update status: ", error);
    }
};

export const wlSingleDel = async (req: Request, res: Response) => {
    console.log("server - work log: single delete");
    try {
        const result = await m_wlSingleArchive(req.body.wlid);

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
        return res.status(405).json({
            status: RES_STATUS.FAILED_DELETE_WORKLOG,
            msg: "Failed: work log: single delete",
            data: null,
        });
    }
};

export const wlGetToday = async (req: TRequestWithUser, res: Response) => {
    const today = genYYYYHHMM(genAUDate());
    console.log(`server - work log: get today's[${today}] work logs`);
    const uid = req.user?.userId as string;
    const admin = req.user?.userId.charAt(0); // M - manager, E - employee
    try {
        let worklogsResult;
        if (admin === uidPrefix.manager) {
            worklogsResult = await m_wlGetTheDay(today);
        } else {
            worklogsResult = await m_wlGetEmployeeTheDay(today, uid);
        }

        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: `successed retrieve today's[${today}] work logs`,
            data: worklogsResult,
        });
    } catch (error) {
        console.log("err: work log: get today's work logs: ", error);
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: "Failed: get today's work logs",
            data: [],
        });
    }
};

export const wlGetTomorrow = async (req: Request, res: Response) => {
    const day = genYYYYHHMM(genAUDate(1));
    console.log(`server - work log: get tomorrow's[${day}] work logs`);
    try {
        const worklogsResult = await m_wlGetTheDay(day);

        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: `successed retrieve tomorrow's[${day}] work logs`,
            data: worklogsResult,
        });
    } catch (error) {
        console.log("err: work log: get tomorrow's work logs: ", error);
        return res.status(400).json({
            status: RES_STATUS.FAILED,
            msg: "Failed: get tomorrow's work logs",
            data: [],
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
        const bTime1 = await m_wlGetBTimeWID(req.body.wlid).then((res) => {
            if (res?.length) return res[0].b_time;
            else return "00:00";
        });
        const bHour = await m_wlGetBHourWID(req.body.wlid).then((res) => {
            if (res?.length) return res[0].b_hour;
            else return "00:00";
        });
        const bTime = calBreakTime(bTime1, bTime2, bHour);

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

export const wlStopWorkTime = async (req: TRequestWithUser, res: Response) => {
    console.log("server - work log: stop work time, wlid: ", req.body.wlid);
    //const uid = req.user?.userId as string;
    const admin = req.user?.userId.charAt(0); // M - manager, E - employee
    try {
        const e_time = genHHMM(genAUDate()) as string;

        let result;
        result = await m_wlUpdateEtime(
            req.body.wlid,
            e_time,
            admin === uidPrefix.manager ? "confirmed" : "processing"
        );

        if (!(result && result.affectedRows)) {
            throw new Error("Failed: work log: stop work time");
        }
        await autoBreakTime(req.body.wlid);
        return res.status(200).json({
            status: RES_STATUS.SUC_UPDATE_WORKLOG,
            msg: `Success:  worklog[${req.body.wlid}] stop work time`,
            data: result,
        });
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

/**
 * @description this function is used to add break time automatically
 *              - default break time is 30 minutes
 *              - this fn will be called on wlStopWorkTime
 * @param wlid
 */
const autoBreakTime = async (wlid: string) => {
    try {
        const bHour = await m_wlGetBHourWID(wlid).then((res) => {
            if (res?.length) return res[0].b_hour;
            else return "00:00";
        });
        const bTime = addBreakTime("00:30", bHour);

        const result = await m_wlUpdateBhour(wlid, bTime as string);
        if (result && result.affectedRows) {
            return true;
        } else {
            throw new Error("Failed: auto break time");
        }
    } catch (error) {
        console.log("err: auto break time: ", error);
        return false;
    }
};
