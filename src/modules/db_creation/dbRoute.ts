import express from "express";
import * as managerCtl from "./dbCon";
const router = express.Router();

router.get("/db_create_table_manager", managerCtl.createTableManager);

export default router;
