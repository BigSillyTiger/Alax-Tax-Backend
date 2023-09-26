const SERVER_NAME: string = "AlaxTax";

const URL_LIST = {
    test: "/test",
};

const DB_TABLE_LIST = {
    MANAGER: "managers",
    ADMIN_LEVEL: "admin_level",
    CLIENT: "clients",
    OD_DETAIL: "order_details",
    OD_STATUS: "order_status",
    VIEW_CLIENTS: "view_clients",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { SERVER_NAME, URL_LIST, DB_TABLE_LIST, sleep };
