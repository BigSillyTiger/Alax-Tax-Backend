import express from "express";
import * as authCtl from "./authCon";
import { authenticateJWT } from "../../middleware/authMW";
import {
    ACCESS_CHECK,
    ADMIN_CHECK,
    LOGIN,
    LOGOUT,
    REGISTER_NEW,
} from "../../utils/reqList";

const router = express.Router();

router.post(REGISTER_NEW, authCtl.registerNewUser);
router.post(LOGIN, authCtl.adminLogin);
router.get(LOGOUT, authCtl.adminLogout);
router.get(ADMIN_CHECK, authenticateJWT, authCtl.authCheck);
router.post(ACCESS_CHECK, authenticateJWT, authCtl.accessCheck);

export default router;
