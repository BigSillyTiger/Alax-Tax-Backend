import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        jwt.verify(
            token,
            "secret_key" /*this needs a real key*/,
            (err, user) => {
                // token is invalid
                if (err) {
                    return res.sendStatus(403);
                }
                req.user = user as User;
                next();
            }
        );
    } else {
        // no token in the header
        res.sendStatus(401);
    }
};

export { authenticateJWT };
