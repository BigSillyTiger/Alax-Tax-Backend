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
import dbRouter from "./modules/db_creation/dbRoute";
import authRouter from "./modules/auth/authRoute";
import dotenv from "dotenv";

//dotenv.config({ path: "../../.env" });
dotenv.config();

const app = express();

//app.use(expressPinoLogger({ logger: logger }));
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(dbRouter);
app.use(authRouter);

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
