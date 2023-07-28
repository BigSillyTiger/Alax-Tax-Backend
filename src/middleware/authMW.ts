import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface User {
    userId: number;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    console.log("-> jwt cookies: ", req.cookies.token);
    if (!token) {
        return res.status(200).json({ msg: "no token in header", auth: false });
    }
    try {
        const decoded = verify(token, process.env.JWT_SECRET as string) as {
            userID: number;
            iat: number;
            exp: number;
        };
        //console.log("-> the decoded: ", decoded);
        req.user!.userId = decoded.userID;
        next();
    } catch (err) {
        return res
            .status(403)
            .json({ msg: "not authorized token", auth: false });
    }
};

export { authenticateJWT };
