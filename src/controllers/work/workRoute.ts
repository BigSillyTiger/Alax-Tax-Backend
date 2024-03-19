import express from "express";
import * as workCtl from "./workCon";

const router = express.Router();

router.post("/work/update", workCtl.wlUpdate);
router.get("/work/all", workCtl.wlAll);
router.post("/work/single-update-hours", workCtl.wlSingleUpdateHours);

export default router;
