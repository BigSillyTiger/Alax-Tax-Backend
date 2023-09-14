import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

interface User {
    userId: number | null;
    username: string;
}

interface RequestWithUser extends Request {
    user?: User;
}

const authenticateJWT = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    logger.infoLog("-> authenticate JWT");
    const token = req.cookies.token;
    if (!token) {
        logger.infoLog("-> jwt cookies empty ");
        return res
            .status(403)
            .json({ status: false, msg: "no token in header" });
    }
    try {
        const decoded = verify(token, process.env.JWT_SECRET as string) as {
            userID: number;
            iat: number;
            exp: number;
        };
        //console.log("-> the decoded: ", decoded);
        req.user = { userId: null, username: "" };
        req.user!.userId = decoded.userID;
        console.log("-> verifed jwt");
        next();
    } catch (err) {
        console.log("-> unverifed jwt: ", err);
        return res
            .status(403)
            .json({ msg: "not authorized token", status: false });
    }
};

export { authenticateJWT };
