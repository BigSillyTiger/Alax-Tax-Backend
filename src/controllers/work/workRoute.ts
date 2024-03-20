import express from "express";
import * as workCtl from "./workCon";

const router = express.Router();

router.post("/work/update", workCtl.wlUpdate);
router.get("/work/all", workCtl.wlAll);
router.post("/work/single-update-hours", workCtl.wlSingleUpdateHours);
router.delete("/work/single-del", workCtl.wlSingleDel);
router.get("/work/today", workCtl.wlGetToday);
router.post("/work/start-timer", workCtl.wlStartWork);
router.post("/work/reset-timer", workCtl.wlResetWorkTime);

export default router;
