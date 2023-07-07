const SERVER_NAME: string = "AlaxTax";
const PORT = 6464;

const URL_LIST = {
    test: "/test",
};

const ALAX_DB_CONFIG = {
    host: "localhost",
    user: "root",
    password: "",
    database: "alax_tax_db",
};

const DB_TABLE_LIST = {
    MANAGER: "managers",
    CLIENT: "clients",
    OD_DETAIL: "order_details",
    OD_STATUS: "order_status",
};

export { SERVER_NAME, ALAX_DB_CONFIG, PORT, URL_LIST, DB_TABLE_LIST };
