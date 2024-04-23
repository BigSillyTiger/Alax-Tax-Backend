import {
    WL_PAUSE_TIMER,
    WL_RESET_TIMER,
    WL_RESUME_TIMER,
    WL_START_TIMER,
    WL_STOP_TIMER,
} from "./reqList";

export const SERVER_NAME: string = "AlaxTax";

export const ALAX_DB_CONFIG = {
    //connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "",
    database: "alax_tax_db",
};

export const URL_LIST = {
    test: "/test",
};

export const DB_TABLE_LIST = {
    // admin
    STAFF: "staff",
    COMPANY: "company",
    // Job
    CLIENT: "client",
    ORDER_LIST: "order_list",
    ORDER_SERVICE: "order_service",
    QUOTATION: "quotation",
    INVOICE: "invoice",
    PAYMENT: "payment",
    // Assiste
    SERVICE: "service",
    UNIT: "unit",
    WORK_LOG: "work_log",
    // payslip
    PAYSLIP: "payslip",
    BONUS: "bonus",
    DEDUCTION: "deduction",
};

export enum RES_STATUS {
    SUCCESS = 200,
    SUC_DEL = 201,
    SUC_UPDATE = 202,
    SUC_UPDATE_STATUS = 203,
    SUC_UPDATE_PAYMENTS = 204,
    SUC_UPDATE_COMPANY = 205,
    SUC_UPDATE_LOGO = 206,
    SUC_ADD_NEW_SU = 207,
    SUC_UPDATE_WORKLOG = 208,
    SUC_DELETE_WORKLOG = 209,
    SUC_INSERT_PAYSLIP = 210,
    SUC_DEL_PAYSLIP = 211,
    SUC_UPDATE_PAYSLIP = 212,
    //
    FAILED = 400,
    FAILED_DUP = 401,
    FAILED_DUP_PHONE = 402,
    FAILED_DUP_EMAIL = 403,
    FAILED_DUP_P_E = 404,
    FAILED_DEL = 405,
    FAILED_ADD_NEW_SU = 406,
    FAILED_UPDATE_WORKLOG = 407,
    FAILED_DELETE_WORKLOG = 408,
    FAILED_INSERT_PAYSLIP = 409,
    FAILED_DEL_PAYSLIP = 410,
    FAILED_UPDATE_PAYSLIP = 411,
}

export const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const uidPrefix = {
    bonus: "B",
    client: "C",
    deduction: "D",
    employee: "E",
    labor: "L",
    manager: "M",
    order: "J",
    payment: "P",
    payslip: "PS",
    workLog: "WL",
};

export const allowedWLTimerURLs = {
    ongoing: [WL_RESET_TIMER, WL_PAUSE_TIMER, WL_STOP_TIMER],
    resting: [WL_RESUME_TIMER, WL_STOP_TIMER],
    pending: [WL_START_TIMER],
    confirmed: [WL_RESET_TIMER],
    unconfirmed: [WL_RESET_TIMER],
    canceled: [],
};

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
