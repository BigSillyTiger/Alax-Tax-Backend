import express from "express";
import {
    CT_ORDER_NEW,
    CT_ORDER_PAYMENT,
    CT_ORDER_UNFINISHED,
    CT_ORDER_UNPAID,
} from "../../utils/reqList";
import { accessCheck } from "../../middleware/accessCheck";
import * as chartCtl from "./chartCon";

const router = express.Router();

router.get(CT_ORDER_PAYMENT, accessCheck, chartCtl.ctAllPayments);
router.get(CT_ORDER_NEW, accessCheck);
router.get(CT_ORDER_UNFINISHED, accessCheck);
router.get(CT_ORDER_UNPAID, accessCheck);

export default router;
