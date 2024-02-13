import express from "express";
import * as staffCtl from "./staffCon";

const router = express.Router();

router.post("/staff/info", staffCtl.staffSingleInfo);
router.post("/staff/single-insert", staffCtl.staffSingleInstert);
//router.put("/staff/single-del", staffCtl.staffSingleDel);
router.put("/staff/single-del", staffCtl.staffSingleArchive);
router.post("/staff/single-archive", staffCtl.staffSingleArchive);
router.put("/staff/single-update", staffCtl.staffSingleUpdate);
router.get("/staff/all", staffCtl.staffAllInfo);
router.put("/staff/update-pw", staffCtl.staffUpdatePW);

export default router;
