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
} from "../../utils/reqList";

const router = express.Router();

router.post(PAYSLIP_SINGLE_INSERT, payslipsCtl.psSingleInsert);

export default router;
