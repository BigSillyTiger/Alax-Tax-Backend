import express from "express";
import * as staffCtl from "./staffCon";

const router = express.Router();

router.post("/staff/info", staffCtl.staffSingleInfo);
router.post("/staff/single-insert", staffCtl.staffSingleInstert);
router.post("/staff/single-del", staffCtl.staffSingleDel);
router.post("/staff/single-archive", staffCtl.staffSingleArchive);
router.put("/staff/single-update", staffCtl.staffSingleUpdate);
router.get("/staff/all", staffCtl.staffAllInfo);

export default router;
