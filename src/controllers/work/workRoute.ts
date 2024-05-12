import express from "express";
import * as workCtl from "./workCon";
import checkWLStatusMW from "../../middleware/checkWLStatus";
import {
    JOB_ASSIGN,
    WL_ALL,
    WL_PAUSE_TIMER,
    WL_RESET_TIMER,
    WL_RESUME_TIMER,
    WL_SINGLE_UPDATE_HND,
    WL_SIGNLE_UPDATE_H,
    WL_STATUS,
    WL_SINGLE_DEL,
    WL_START_TIMER,
    WL_STOP_TIMER,
    WL_TODAY,
    WL_SIGNLE_UPDATE_D,
    WL_TOMORROW,
} from "../../utils/reqList";
import { accessCheckM } from "../../middleware/accessCheckM";
import { authMW } from "../../middleware/authMW";
const router = express.Router();

router.post(JOB_ASSIGN, [accessCheckM], workCtl.wlUpdate);
router.get(WL_ALL, [authMW], workCtl.wlAll);
router.post(WL_SINGLE_UPDATE_HND, [authMW], workCtl.wlSingleUpdateHND);
router.post(
    WL_SIGNLE_UPDATE_D,
    [accessCheckM],
    workCtl.wlSingleUpdateDeduction
);
router.post(WL_SIGNLE_UPDATE_H, [accessCheckM], workCtl.wlSingleUpdateHours);
router.delete(WL_SINGLE_DEL, [accessCheckM], workCtl.wlSingleDel);
router.get(WL_TODAY, [authMW], workCtl.wlGetToday);
//router.get(WL_TOMORROW, workCtl.wlGetTomorrow);
router.put(WL_STATUS, [accessCheckM], workCtl.wlChangeStatus);
router.post(WL_START_TIMER, [authMW, checkWLStatusMW], workCtl.wlStartWorkTime);
router.post(WL_RESET_TIMER, [authMW, checkWLStatusMW], workCtl.wlResetWorkTime);
router.post(WL_PAUSE_TIMER, [authMW, checkWLStatusMW], workCtl.wlPauseWorkTime);
router.post(
    WL_RESUME_TIMER,
    [authMW, checkWLStatusMW],
    workCtl.wlResumeWorkTime
);
router.post(WL_STOP_TIMER, [authMW, checkWLStatusMW], workCtl.wlStopWorkTime);

export default router;
