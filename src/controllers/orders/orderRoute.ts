import express from "express";
import * as orderCtl from "./orderCon";
const router = express.Router();

router.get("/order/all", orderCtl.orderAll);
router.post("/order/withClientID", orderCtl.orderWcid);
router.post("/order/findClient", orderCtl.findClient);
router.post("/order/findOrder", orderCtl.findOrder);
router.post("/order/add", orderCtl.orderAdd);
router.delete("/order/del", orderCtl.orderDel);
router.put("/order/update", orderCtl.orderUpdate);
router.put("/order/status", orderCtl.orderChangeStatus);
router.post("/order/clientOrders", orderCtl.clientOrders);
router.put("/order/updatePayments", orderCtl.orderUpdatePayments);

export default router;
