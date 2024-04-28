import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../libs/logger";
import { RES_STATUS, uidPrefix } from "../utils/config";
import { TRequestWithUser } from "../utils/global";

dotenv.config();

/**
 * @description middleware to check if user is the manager to access the route
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const accessCheckE = (
    req: TRequestWithUser,
    res: Response,
    next: NextFunction
) => {
    logger.infoLog("-> MW: Employee access checking...");
    const token = req.cookies.token;
    if (!token) {
        logger.infoLog("-> jwt cookies empty ");
        return res.status(403).json({
            status: RES_STATUS.FAILED,
            msg: "no token in header",
            data: false,
        });
    }
    try {
        const decoded = verify(token, process.env.JWT_SECRET as string) as {
            userID: string;
            iat: number;
            exp: number;
        };
        if (decoded.userID.charAt(0) !== uidPrefix.employee) {
            throw new Error("Not Employee");
        }
        // add user attr to req
        req.user = { userId: "" };
        req.user!.userId = decoded.userID;
        console.log("-> verifed Employee jwt");
        next();
    } catch (err) {
        console.log("-> unverifed employee jwt: ", err);
        return res.status(403).json({
            msg: "not authorized token",
            status: RES_STATUS.FAILED,
            data: false,
        });
    }
};
