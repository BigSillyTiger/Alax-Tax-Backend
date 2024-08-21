import express from "express";
import * as orderCtl from "./orderCon";
import {
    INVOICE_ISSUE_UPDATE,
    ORDER_ADD,
    ORDER_ALL,
    ORDER_DEL,
    ORDER_STATUS,
    ORDER_UPDATE,
    ORDER_W_CLIENT,
    ORDER_SERVICE_W_CLIENT,
    PAYMENT_UPDATE,
    ORDER_SERVICE_ALL,
} from "../../utils/reqList";
import { accessCheckM } from "../../middleware/accessCheckM";

const router = express.Router();

router.get(ORDER_ALL, orderCtl.orderAll);
router.get(ORDER_SERVICE_ALL, orderCtl.orderAllService);
router.post(ORDER_W_CLIENT, [accessCheckM], orderCtl.orderWithCid);
router.post(
    ORDER_SERVICE_W_CLIENT,
    [accessCheckM],
    orderCtl.orderServiceWithCid
);
router.post("/order/findClient", orderCtl.findClient);
router.post("/order/findOrder", orderCtl.findOrder);
router.post(ORDER_ADD, [accessCheckM], orderCtl.orderAdd);
router.delete(ORDER_DEL, [accessCheckM], orderCtl.orderDel);
router.put(ORDER_UPDATE, [accessCheckM], orderCtl.orderUpdate);
router.put(ORDER_STATUS, [accessCheckM], orderCtl.orderChangeStatus);
router.put(PAYMENT_UPDATE, [accessCheckM], orderCtl.orderUpdatePayments);
router.put(INVOICE_ISSUE_UPDATE, [accessCheckM], orderCtl.updateInvoiceIssue);

export default router;
