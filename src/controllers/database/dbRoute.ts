import express from "express";
import * as managerCtl from "./dbCon";
const router = express.Router();

router.get("/db_init", managerCtl.dbInit);
router.get("/db_test", managerCtl.dbTest);

export default router;
