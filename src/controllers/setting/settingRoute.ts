import express from "express";
import * as managerCtl from "./settingCon";
import uploadMW from "../../middleware/uploader";
import clearDirectoryMW from "../../middleware/clearDirectory";
import findLogoMW from "../../middleware/findLogo";
const router = express.Router();

router.get("/manage/uni_all", managerCtl.universAll);
router.post("/manage/uni_del", managerCtl.uniDel);
router.put("/manage/uni_edit", managerCtl.uniEdit);
router.post("/manage/uni_add", managerCtl.uniAdd);
router.get("/manage/company_get", managerCtl.getCompany);
router.put("/manage/company_update", managerCtl.updateCompany);
router.put(
    "/manage/logo_update",
    clearDirectoryMW,
    uploadMW.single("logo"),
    managerCtl.updateLogo
);
router.get("/manage/logo", findLogoMW, managerCtl.getLogo);

export default router;
