import express from "express";
import {
    CT_ORDER_NEW,
    CT_ORDER_PAYMENT,
    CT_ORDER_UNFINISHED,
    CT_ORDER_UNPAID,
} from "../../utils/reqList";
import { authMW } from "../../middleware/authMW";
import * as chartCtl from "./chartCon";

const router = express.Router();

router.get(CT_ORDER_PAYMENT, [authMW], chartCtl.ctAllPayments);
/* router.get(CT_ORDER_NEW, accessCheckM);
router.get(CT_ORDER_UNFINISHED, accessCheckM);
router.get(CT_ORDER_UNPAID, accessCheckM); */

export default router;
