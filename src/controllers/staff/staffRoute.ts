import express from "express";
import * as staffCtl from "./staffCon";
import {
    STAFF_ALL,
    STAFF_INFO,
    STAFF_SINGLE_DEL,
    STAFF_SINGLE_REGISTER,
    STAFF_SINGLE_UPDATE,
    STAFF_UPDATE_PW,
} from "../../utils/reqList";
import { accessCheckM } from "../../middleware/accessCheckM";
import { authMW } from "../../middleware/authMW";

const router = express.Router();

router.post(STAFF_INFO, staffCtl.staffSingleInfo);
router.post(STAFF_SINGLE_REGISTER, [accessCheckM], staffCtl.staffSingleInstert);
//router.put("/staff/single-del", staffCtl.staffSingleDel);
router.put(STAFF_SINGLE_DEL, [accessCheckM], staffCtl.staffSingleArchive);
router.post("/staff/single-archive", staffCtl.staffSingleArchive);
router.put(STAFF_SINGLE_UPDATE, [authMW], staffCtl.staffSingleUpdate);
router.get(STAFF_ALL, [authMW], staffCtl.staffAllInfo);
router.put(STAFF_UPDATE_PW, staffCtl.staffUpdatePW);

export default router;
