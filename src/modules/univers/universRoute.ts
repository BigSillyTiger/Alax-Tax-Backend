import express from "express";
import * as managerCtl from "./universCon";
const router = express.Router();

router.get("/manage/univers_all", managerCtl.universAll);
router.post("/manage/service_add", managerCtl.serviceAdd);
router.post("/manage/unit_add", managerCtl.unitAdd);
router.post("/manage/uni_del", managerCtl.uniDel);

export default router;
