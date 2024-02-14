import express from "express";
import * as authCtl from "./authCon";
import { authenticateJWT } from "../../middleware/authMW";

const router = express.Router();

router.post("/register_new", authCtl.registerNewUser);
router.post("/adminLogin", authCtl.adminLogin);
router.get("/adminLogout", authCtl.adminLogout);
router.get("/adminCheck", authenticateJWT, authCtl.authCheck);
router.post("/accessCheck", authenticateJWT, authCtl.accessCheck);

export default router;
