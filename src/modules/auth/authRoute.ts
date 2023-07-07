import express from "express";

import logger from "../../utils/logger";
import { URL_LIST } from "../../utils/config";
import * as authCtl from "./authCon";

const router = express.Router();

router.post("/register_new", authCtl.register);

export default router;
