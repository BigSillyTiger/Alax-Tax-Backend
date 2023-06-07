import uuid from "uuid";
import logger from "../utils/logger";
import { Request, Response } from "express";

const test = async (req: Request, res: Response) => {
    logger.infoLog("receive req");
    res.status(200).json({ success: "test successfull~~" });
};

export { test };
