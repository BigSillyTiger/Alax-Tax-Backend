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
    PAYMENT_UPDATE,
    ORDER_ALL_ARRANGEMENT,
} from "../../utils/reqList";
import { authMW } from "../../middleware/authMW";

const router = express.Router();

router.get(ORDER_ALL, orderCtl.orderAll);
router.post(ORDER_W_CLIENT, orderCtl.orderWcid);
router.post("/order/findClient", orderCtl.findClient);
router.post("/order/findOrder", orderCtl.findOrder);
router.post(ORDER_ADD, orderCtl.orderAdd);
router.delete(ORDER_DEL, orderCtl.orderDel);
router.put(ORDER_UPDATE, orderCtl.orderUpdate);
router.put(ORDER_STATUS, orderCtl.orderChangeStatus);
router.post("/order/clientOrders", orderCtl.clientOrders);
router.put(PAYMENT_UPDATE, orderCtl.orderUpdatePayments);
router.put(INVOICE_ISSUE_UPDATE, orderCtl.updateInvoiceIssue);
router.get(ORDER_ALL_ARRANGEMENT, [authMW], orderCtl.orderAllArrangement);

export default router;
