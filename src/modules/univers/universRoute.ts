import express from "express";
import * as managerCtl from "./universCon";
const router = express.Router();

router.get("/manage/uni_all", managerCtl.universAll);
router.post("/manage/uni_del", managerCtl.uniDel);
router.put("/manage/uni_edit", managerCtl.uniEdit);
router.post("/manage/uni_add", managerCtl.uniAdd);

export default router;
