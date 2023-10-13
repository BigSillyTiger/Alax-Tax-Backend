import express from "express";
import * as orderCtl from "./orderCon";
const router = express.Router();

router.get("/order/all", orderCtl.orderAll);
router.get("/order/add", orderCtl.orderAdd);
router.get("/order/del", orderCtl.orderDel);
router.put("/order/update", orderCtl.orderUpdate);

export default router;
