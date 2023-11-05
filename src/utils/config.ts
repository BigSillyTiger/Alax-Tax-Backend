const SERVER_NAME: string = "AlaxTax";

const URL_LIST = {
    test: "/test",
};

const DB_TABLE_LIST = {
    // admin
    MANAGERS: "managers",
    ADMIN_LEVEL: "admin_level",
    // Job
    CLIENTS: "clients",
    ORDERS: "orders",
    ORDER_DESC: "order_desc",
    QUOTATIONS: "quotations",
    INVOICES: "invoices",
    PAYMENTS: "payments",
    // Assiste
    SERVICES: "services",
    UNITS: "units",
};

enum RES_STATUS {
    SUCCESS = 200,
    SUC_DEL = 201,
    SUC_UPDATE = 202,
    SUC_UPDATE_STATUS = 203,
    SUC_UPDATE_PAYMENTS = 204,
    //
    FAILED = 400,
    FAILED_DUP = 401,
    FAILED_DUP_PHONE = 402,
    FAILED_DUP_EMAIL = 403,
    FAILED_DUP_P_E = 404,
    FAILED_DEL = 405,
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { SERVER_NAME, URL_LIST, DB_TABLE_LIST, sleep, RES_STATUS };
