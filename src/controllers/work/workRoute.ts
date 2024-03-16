import express from "express";
import * as workCtl from "./workCon";

const router = express.Router();

router.post("/work/update", workCtl.wlUpdate);
router.get("/work/all", workCtl.wlAll);

export default router;
