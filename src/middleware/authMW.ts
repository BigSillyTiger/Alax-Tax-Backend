import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
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
    //const authHeader = req.headers["authorization"];
    //console.log("--> server cookies recv: ", req.cookies);
    //const token = authHeader && req.headers.authorization?.split(" ")[1];
    const token = req.cookies.token;
    //console.log("-> jwt cookies: ", req.cookies.token);
    if (token) {
        jwt.verify(
            token,
            process.env.JWT_SECRET as string,
            (err: any, user: any) => {
                // token is invalid
                if (err) {
                    return res
                        .status(403)
                        .json({ msg: "not authorized token" });
                }
                req.user = user as User;
                next();
            }
        );
    } else {
        // no token in the header
        res.sendStatus(401).json({ msg: "no token in header" });
    }
};

export { authenticateJWT };
