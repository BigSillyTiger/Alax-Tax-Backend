//const path = require("path");
//const express = require("express");
//const cookieParser = require("cookie-parser");
//const expressPinoLogger = require("express-pino-logger");
//const cors = require("cors");
//const logger = require("./utils/logger");

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import expressPinoLogger from "express-pino-logger";
import cors from "cors";

import logger from "./libs/logger";
import dbRouter from "./controllers/database/dbRoute";
import authRouter from "./controllers/auth/authRoute";
import clientRouter from "./controllers/clients/clientRoute";
import settingRouter from "./controllers/setting/settingRoute";
import orderRouter from "./controllers/orders/orderRoute";
import staffRouter from "./controllers/staff/staffRoute";
import workRouter from "./controllers/work/workRoute";
import payslipRouter from "./controllers/payslips/payslipsRoute";
import chartRouter from "./controllers/charts/chartRoute";
import dotenv from "dotenv";

//dotenv.config({ path: "../../.env" });
dotenv.config();

const app = express();

//app.use(expressPinoLogger({ logger: logger }));
//app.use(cors({ credentials: true, origin: "http://170.64.177.203:5002" }));
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/*
 * adding router
 */
app.use(dbRouter);
app.use(authRouter);
app.use(clientRouter);
app.use(orderRouter);
app.use(settingRouter);
app.use(staffRouter);
app.use(workRouter);
app.use(payslipRouter);
app.use(chartRouter);
app.use(express.static("./public"));

app.listen(process.env.PORT || 5005, () => {
    logger.infoLog(`server runs on ${process.env.PORT || 5005}`);
});
/* 
createConnection()
    .then(() => {
        
        app.listen(PORT, () => {
            logger.infoLog(`server runs on ${PORT}`);
        });
    })
    .catch((err) => {
        logger.errLog(err);
    });
 */

//mysql://efylnj961wm0fk7k:t8j4ewa2wboyh2od@z3iruaadbwo0iyfp.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/p5b9wocijt2qpli4
