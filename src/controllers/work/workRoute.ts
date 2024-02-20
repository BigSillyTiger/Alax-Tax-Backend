import express from "express";
import * as workCtl from "./workCon";

const router = express.Router();

router.post("/work/add", workCtl.workAdd);

export default router;
