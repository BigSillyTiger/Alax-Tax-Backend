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
import { accessCheck } from "../../middleware/accessCheck";

const router = express.Router();

router.post(CLIENT_INFO, clientCtl.clientInfo);
router.post(CLIENT_MULTIPLE_INSERT, accessCheck, clientCtl.clientMulInstert);
router.post(CLIENT_SINGLE_REGISTER, accessCheck, clientCtl.clientSingleInstert);
router.post(CLIENT_SINGLE_DEL, accessCheck, clientCtl.clientSingleDel);
router.post(
    "/client/single-archive",
    accessCheck,
    clientCtl.clientSingleArchive
);
router.put(CLIENT_SINGLE_UPDATE, accessCheck, clientCtl.clientSingleUpdate);
router.get(CLIENT_ALL, clientCtl.clientGetAll);

export default router;
