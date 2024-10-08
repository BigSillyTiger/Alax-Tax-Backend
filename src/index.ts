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
import chartRouter from "./controllers/charts/chartRoute";
import dotenv from "dotenv";
import corsOptions from "./config/corsOptions";
//const bodyParser = require("body-parser");

//dotenv.config({ path: "../../.env" });
dotenv.config();

const app = express();

//app.use(bodyParser.json({ limit: "10000kb", extended: true }));
//app.use(bodyParser.urlencoded({ limit: "10000kb", extended: true }));

//app.use(expressPinoLogger({ logger: logger }));
//app.use(cors({ credentials: true, origin: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
//app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
//app.use(express.urlencoded({ extended: true }));
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
app.use(chartRouter);
app.use(express.static("./public"));

app.listen(process.env.PORT || 5005, () => {
    logger.infoLog(`server runs on ${process.env.PORT || 5005}`);
});
