import express from "express";
import * as servicesCtl from "./servicesCon";
import { accessCheckM } from "../../middleware/accessCheckM";
import { authMW } from "../../middleware/authMW";
import { SERVICE_W_CLIENT } from "../../utils/reqList";

const router = express.Router();

router.post(
    SERVICE_W_CLIENT,
    [accessCheckM, authMW],
    servicesCtl.servicesWClient
);

export default router;
