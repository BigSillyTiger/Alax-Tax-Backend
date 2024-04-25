import express from "express";
import * as clientCtl from "./clientCon";
import {
    CLIENT_ALL,
    CLIENT_INFO,
    CLIENT_MULTIPLE_INSERT,
    CLIENT_SINGLE_DEL,
    CLIENT_SINGLE_REGISTER,
    CLIENT_SINGLE_UPDATE,
} from "../../utils/reqList";
import { accessCheckM } from "../../middleware/accessCheckM";

const router = express.Router();

router.post(CLIENT_INFO, clientCtl.clientInfo);
router.post(CLIENT_MULTIPLE_INSERT, [accessCheckM], clientCtl.clientMulInstert);
router.post(
    CLIENT_SINGLE_REGISTER,
    [accessCheckM],
    clientCtl.clientSingleInstert
);
router.post(CLIENT_SINGLE_DEL, [accessCheckM], clientCtl.clientSingleDel);
router.post(
    "/client/single-archive",
    [accessCheckM],
    clientCtl.clientSingleArchive
);
router.put(CLIENT_SINGLE_UPDATE, [accessCheckM], clientCtl.clientSingleUpdate);
router.get(CLIENT_ALL, clientCtl.clientGetAll);

export default router;
