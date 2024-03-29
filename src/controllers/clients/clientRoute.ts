import express from "express";
import * as clientCtl from "./clientCon";

const router = express.Router();

router.post("/client/info", clientCtl.clientInfo);
router.post("/client/multiple-insert", clientCtl.clientMulInstert);
router.post("/client/single-insert", clientCtl.clientSingleInstert);
router.post("/client/single-del", clientCtl.clientSingleDel);
router.post("/client/single-archive", clientCtl.clientSingleArchive);
router.put("/client/single-update", clientCtl.clientSingleUpdate);
router.get("/client/all", clientCtl.clientGetAll);

export default router;
