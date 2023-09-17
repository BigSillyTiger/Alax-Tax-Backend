import express from "express";
import * as clientCtl from "./clientCon";

const router = express.Router();

router.post("/client/multiple-insert", clientCtl.clientMulInstert);

export default router;
