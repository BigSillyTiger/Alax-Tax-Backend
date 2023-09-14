import { SERVER_NAME } from "./config";

const pinoLogger = require("pino")({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:dd-mm-yyyy HH:MM:SS",
            ignore: "pid, hostname",
        },
    },
});

const infoLog = (msg: any) => {
    pinoLogger.info("[" + SERVER_NAME + "'s Info]: " + msg);
};

const warnLog = (msg: any) => {
    pinoLogger.warn("[" + SERVER_NAME + "'s Warn]: " + msg);
};

const errLog = (msg: any) => {
    pinoLogger.error("[" + SERVER_NAME + "'s Err]: " + msg);
};

export default { infoLog, warnLog, errLog };
