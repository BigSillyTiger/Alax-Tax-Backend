import express from "express";

import logger from "../utils/logger";
import { URL_LIST } from "../utils/config";
import * as authCtl from "../controllers/authCtl";

const router = express.Router();

router.get("/test", authCtl.test);

export default router;
