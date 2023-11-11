import express from "express";
import * as managerCtl from "./manageCon";
const router = express.Router();

router.get("/manage/uni_all", managerCtl.universAll);
router.post("/manage/uni_del", managerCtl.uniDel);
router.put("/manage/uni_edit", managerCtl.uniEdit);
router.post("/manage/uni_add", managerCtl.uniAdd);
router.get("/manage/company_get", managerCtl.getCompany);
router.put("/manage/company_update", managerCtl.updateCompany);

export default router;
