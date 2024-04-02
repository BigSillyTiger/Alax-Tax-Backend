import express from "express";
import * as managerCtl from "./settingCon";
import uploadMW from "../../middleware/uploader";
import clearDirectoryMW from "../../middleware/clearDirectory";
import findLogoMW from "../../middleware/findLogo";
import {
    SETTING_GET_COMPANY,
    SETTING_LOGO,
    SETTING_LOGO_UPDATE,
    SETTING_UNI_ADD,
    SETTING_UNI_ALL,
    SETTING_UNI_DEL,
    SETTING_UNI_EDIT,
    SETTING_UPDATE_COMPANY,
} from "../../utils/reqList";
const router = express.Router();

router.get(SETTING_UNI_ALL, managerCtl.universAll);
router.post(SETTING_UNI_DEL, managerCtl.uniDel);
router.put(SETTING_UNI_EDIT, managerCtl.uniEdit);
router.post(SETTING_UNI_ADD, managerCtl.uniAdd);
router.get(SETTING_GET_COMPANY, managerCtl.getCompany);
router.put(SETTING_UPDATE_COMPANY, managerCtl.updateCompany);
router.put(
    SETTING_LOGO_UPDATE,
    clearDirectoryMW,
    uploadMW.single("logo"),
    managerCtl.updateLogo
);
router.get(SETTING_LOGO, findLogoMW, managerCtl.getLogo);

export default router;
