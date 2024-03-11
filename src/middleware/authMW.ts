import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../utils/logger";
import { RES_STATUS } from "../utils/config";
import { TRequestWithUser } from "../utils/global";

dotenv.config();

const authenticateJWT = (
    req: TRequestWithUser,
    res: Response,
    next: NextFunction
) => {
    logger.infoLog("-> authenticate JWT checking...");
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
        // add user attr to req
        req.user = { userId: "", username: "" };
        req.user!.userId = decoded.userID;
        console.log("-> verifed jwt");
        next();
    } catch (err) {
        console.log("-> unverifed jwt: ", err);
        return res.status(403).json({
            msg: "not authorized token",
            status: RES_STATUS.FAILED,
            data: false,
        });
    }
};

export { authenticateJWT };
