const SERVER_NAME: string = "AlaxTax";

const ALAX_DB_CONFIG = {
    //connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "",
    database: "alax_tax_db",
};

const URL_LIST = {
    test: "/test",
};

const DB_TABLE_LIST = {
    // admin
    STAFF: "staff",
    MANAGERS: "managers",
    COMPANY: "company",
    // Job
    CLIENTS: "clients",
    ORDERS: "orders",
    ORDER_SERVICES: "order_services",
    QUOTATIONS: "quotations",
    INVOICES: "invoices",
    PAYMENTS: "payments",
    // Assiste
    SERVICES: "services",
    UNITS: "units",
    WORK_LOGS: "work_logs",
};

enum RES_STATUS {
    SUCCESS = 200,
    SUC_DEL = 201,
    SUC_UPDATE = 202,
    SUC_UPDATE_STATUS = 203,
    SUC_UPDATE_PAYMENTS = 204,
    SUC_UPDATE_COMPANY = 205,
    SUC_UPDATE_LOGO = 206,
    SUC_ADD_NEW_SU = 207,
    SUC_UPDATE_WORKLOG = 208,
    //
    FAILED = 400,
    FAILED_DUP = 401,
    FAILED_DUP_PHONE = 402,
    FAILED_DUP_EMAIL = 403,
    FAILED_DUP_P_E = 404,
    FAILED_DEL = 405,
    FAILED_ADD_NEW_SU = 406,
    FAILED_UPDATE_WORKLOG = 407,
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const uidPrefix = {
    manager: "M",
    employee: "E",
    client: "C",
    order: "J",
    workLog: "WL",
};

export {
    SERVER_NAME,
    URL_LIST,
    DB_TABLE_LIST,
    sleep,
    RES_STATUS,
    ALAX_DB_CONFIG,
    uidPrefix,
};
