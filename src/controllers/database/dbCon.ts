import { Request, Response } from "express";
import { createTables, testAPI } from "../../models/tablesInitModel";
import { RES_STATUS } from "../../utils/config";

const dbInit = async (req: Request, res: Response) => {
    console.log("-> database init req");
    console.log("-> the default port is: ", Number(process.env.MYSQL_PORT));
    const result = await createTables();
    if (result) {
        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "Successed: create tables",
            data: null,
        });
    } else {
        return res.status(500).json({
            status: RES_STATUS.FAILED,
            msg: "Failed: create tables",
            data: null,
        });
    }
};

const dbTest = async (req: Request, res: Response) => {
    const result = await testAPI();
    return res.status(200).json(result);
};

export { dbInit, dbTest };
