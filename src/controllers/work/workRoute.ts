import express from "express";
import * as workCtl from "./workCon";
import checkWLStatusMW from "../../middleware/checkWLStatus";
import {
    JOB_ASSIGN,
    WL_ALL,
    WL_PAUSE_TIMER,
    WL_RESET_TIMER,
    WL_RESUME_TIMER,
    WL_SIGNLE_UPDATE_H,
    WL_SINGLE_DEL,
    WL_START_TIMER,
    WL_STOP_TIMER,
    WL_TODAY,
} from "../../utils/reqList";
const router = express.Router();

router.post(JOB_ASSIGN, workCtl.wlUpdate);
router.get(WL_ALL, workCtl.wlAll);
router.post(WL_SIGNLE_UPDATE_H, workCtl.wlSingleUpdateHours);
router.delete(WL_SINGLE_DEL, workCtl.wlSingleDel);
router.get(WL_TODAY, workCtl.wlGetToday);
router.post(WL_START_TIMER, checkWLStatusMW, workCtl.wlStartWorkTime);
router.post(WL_RESET_TIMER, checkWLStatusMW, workCtl.wlResetWorkTime);
router.post(WL_PAUSE_TIMER, checkWLStatusMW, workCtl.wlPauseWorkTime);
router.post(WL_RESUME_TIMER, checkWLStatusMW, workCtl.wlResumeWorkTime);
router.post(WL_STOP_TIMER, checkWLStatusMW, workCtl.wlStopWorkTime);

export default router;
