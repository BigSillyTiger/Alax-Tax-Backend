import { Request, Response, NextFunction } from "express";
import { RES_STATUS } from "../utils/config";
import { TRequestWithUser } from "../utils/global";
import { checkWLStatus } from "../libs/utils";
import { allowedWLTimerURLs } from "../utils/config";

const checkWLStatusMW = async (
    req: TRequestWithUser,
    res: Response,
    next: NextFunction
) => {
    const wlid = req.body.wlid;
    const url = req.originalUrl;
    try {
        const status = await checkWLStatus(wlid);
        const isURLAllowed = (allowedWLTimerURLs as Record<string, string[]>)[
            status
        ]?.includes(url);
        if (isURLAllowed) {
            next();
        } else throw new Error("Work log is not ongoing");
    } catch (error) {
        console.log("-> checkWLStatusMW: ", error);
        return res.status(403).json({
            status: RES_STATUS.FAILED,
            msg: "Work log is not ongoing",
            data: false,
        });
    }
};

export default checkWLStatusMW;
