import express from "express";
import * as clientCtl from "./clientCon";

const router = express.Router();

router.post("/client/multiple-insert", clientCtl.clientMulInstert);
router.post("/client/single-insert", clientCtl.clientSingleInstert);
router.get("/client/all", clientCtl.clientGetAll);

export default router;
