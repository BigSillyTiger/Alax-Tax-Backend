import express from "express";
import * as authCtl from "./authCon";
import { authMW } from "../../middleware/authMW";
import {
    ACCESS_CHECK,
    ADMIN_CHECK,
    LOGIN,
    LOGOUT,
    REGISTER_NEW,
    TEST,
} from "../../utils/reqList";

const router = express.Router();

router.post(REGISTER_NEW, authCtl.registerNewUser);
router.post(LOGIN, authCtl.adminLogin);
router.get(LOGOUT, authCtl.adminLogout);
router.get(ADMIN_CHECK, [authMW], authCtl.adminCheck);
router.post(ACCESS_CHECK, [authMW], authCtl.accessCheckM);
router.get(TEST, authCtl.test);

export default router;
