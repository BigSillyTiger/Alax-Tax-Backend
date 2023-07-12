import express from "express";
import * as authCtl from "./authCon";
import { authenticateJWT } from "../../middleware/authMW";

const router = express.Router();

router.post("/register_new", authCtl.registerNewUser);
router.post("/login", authCtl.loginUser);
router.get("/protected", authenticateJWT, authCtl.authCheck);

export default router;
