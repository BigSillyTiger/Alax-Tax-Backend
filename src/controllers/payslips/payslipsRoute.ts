import express from "express";
import * as payslipsCtl from "./payslipsCon";
import checkWLStatusMW from "../../middleware/checkWLStatus";
import {
    PAYSLIP_ALL,
    PAYSLIP_SINGLE_ARCHIVE,
    PAYSLIP_SINGLE_DEL,
    PAYSLIP_SINGLE_INSERT,
    PAYSLIP_SINGLE_UPDATE,
    PAYSLIP_ALL_W_UID,
    PAYSLIP_STATUS_UPDATE,
    PAYSLIP_BONUS_ALL,
} from "../../utils/reqList";
import { accessCheckM } from "../../middleware/accessCheckM";
import { authMW } from "../../middleware/authMW";

const router = express.Router();

router.post(PAYSLIP_SINGLE_INSERT, [accessCheckM], payslipsCtl.psSingleInsert);
router.post(PAYSLIP_SINGLE_DEL, [accessCheckM], payslipsCtl.psSingleDel);
router.put(PAYSLIP_STATUS_UPDATE, [accessCheckM], payslipsCtl.psStatusUpdate);
router.get(PAYSLIP_BONUS_ALL, [authMW], payslipsCtl.psBonusAll);
router.get(PAYSLIP_ALL, [authMW], payslipsCtl.psAll);

export default router;
