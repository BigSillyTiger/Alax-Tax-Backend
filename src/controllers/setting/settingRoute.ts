import express from "express";
import * as managerCtl from "./settingCon";
import uploadMW from "../../middleware/uploader";
import clearDirectoryMW from "../../middleware/clearDirectory";
import findLogoMW from "../../middleware/findLogo";
const router = express.Router();

router.get("/setting/uni_all", managerCtl.universAll);
router.post("/setting/uni_del", managerCtl.uniDel);
router.put("/setting/uni_edit", managerCtl.uniEdit);
router.post("/setting/uni_add", managerCtl.uniAdd);
router.get("/setting/company_get", managerCtl.getCompany);
router.put("/setting/company_update", managerCtl.updateCompany);
router.put(
    "/setting/logo_update",
    clearDirectoryMW,
    uploadMW.single("logo"),
    managerCtl.updateLogo
);
router.get("/setting/logo", findLogoMW, managerCtl.getLogo);

export default router;
