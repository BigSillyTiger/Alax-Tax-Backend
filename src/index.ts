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

import logger from "./utils/logger";
import { PORT } from "./utils/config";
import authRouter from "./routes/authRoute";
import testRouter from "./routes/testRoute";
import { createConnection, connectDB } from "./database";
//require("dotenv").config();

const app = express();

//app.use(expressPinoLogger({ logger: logger }));
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(authRouter);
app.use(testRouter);

app.listen(PORT, () => {
    logger.infoLog(`server runs on ${PORT}`);
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
