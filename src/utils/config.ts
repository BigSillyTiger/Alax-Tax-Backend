const SERVER_NAME: string = "AlaxTax";

const URL_LIST = {
    test: "/test",
};

const DB_TABLE_LIST = {
    MANAGERS: "managers",
    ADMIN_LEVEL: "admin_level",
    CLIENTS: "clients",
    OD_DETAIL: "order_details",
    OD_STATUS: "order_status",
    VIEW_CLIENTS: "view_clients",
    SERVICES: "services",
    UNITS: "units",
};

enum RESPONSE_STATUS {
    SUCCESS = 200,
    SUC_DEL_SINGLE = 201,
    SUC_UPDATE = 202,
    //
    FAILED = 400,
    FAILED_DUP = 401,
    FAILED_DUP_PHONE = 402,
    FAILED_DUP_EMAIL = 403,
    FAILED_DUP_P_E = 404,
    FAILED_DEL = 405,
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { SERVER_NAME, URL_LIST, DB_TABLE_LIST, sleep, RESPONSE_STATUS };
