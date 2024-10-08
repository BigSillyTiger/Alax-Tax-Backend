import { Request } from "express";

export type TRequestWithUser = Request & {
    user?: {
        userId: string;
    };
};

export type Tlevel = {
    uid: string;
    first_name: string;
    last_name: string;
    role: "manager" | "employee" | "labor";
    access: boolean;
    dashboard: number;
    clients: number;
    orders: number;
    services: number;
    calendar: number;
    staff: number;
    setting: number;
};

export type TclientData = {
    cid: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address: string;
    suburb: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
};

export type Tcompany = {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    bld: string;
    abn: string;
    bsb: string;
    acc: string;
    logoName: string;
    deposit_rate: number;
};

export type Torder = {
    oid?: string; // new order does not have oid
    archive: boolean;
    fk_cid: string;
    status: string;
    gst: number;
    net: number;
    total: number;
    paid: number;
    q_deposit: number;
    q_valid: number;
    q_date: string;
    created_date: string;
    estimate_finish_date: string;
    i_date: string;
    note: string;
};

export type Tpayment = {
    pid: string;
    fk_oid: string;
    paid: number;
    paid_date: string;
};

export type TpageAccess = 0 | 1 | 2;

export type TstaffData = {
    uid: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    password: string;
    address: string;
    role: "manager" | "employee";
    access: boolean;
    suburb: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    dashboard: TpageAccess;
    clients: TpageAccess;
    orders: TpageAccess;
    services: TpageAccess;
    calendar: TpageAccess;
    staff: TpageAccess;
    setting: TpageAccess;
    hr: number;
    bsb: string;
    account: string;
};

export type TassignedWork = {
    wlid: string;
    fk_uid: string;
    wl_date: string;
    s_time: string;
    e_time: string;
    b_time: string;
    b_hour: string;
    wl_status: string;
    confirm_status: boolean;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    role: string;
};

import { Request } from "express";

export type TRequestWithUser = Request & {
    user?: {
        userId: string;
        username: string;
    };
};

export type Tcompany = {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    bld: string;
    abn: string;
    bsb: string;
    acc: string;
    logoName: string;
};

export type Torder = {
    oid?: string; // new order does not have oid
    fk_cid: string;
    address: string;
    suburb: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    status: string;
    deposit: number;
    gst: number;
    total: number;
};

// order service
export type Tservice = {
    osid: string;
    fk_oid: string;
    title: string;
    ranking: number;
    status: string;
    taxable: boolean;
    qty: number;
    unit: string;
    unit_price: number;
    gst: number;
    net: number;
    created_date: string;
    expiry_date: string;
    service_type: string;
    product_name: string;
    archive: boolean;
    note: string;
};

export type TpageAccess = 0 | 1 | 2;

export type TstaffData = {
    uid: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    password: string;
    address: string;
    role: "manager" | "employee" | "labor";
    suburb: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    bsb: string;
    account: string;
    dashboard: TpageAccess;
    clients: TpageAccess;
    orders: TpageAccess;
    services: TpageAccess;
    calendar: TpageAccess;
    staff: TpageAccess;
    setting: TpageAccess;
};

export type TnewStaff = Partical<TstaffData> & {
    pwConfirm: string;
};

export type TwlUnion = {
    fk_oid: string;
    wl_date: string;
    assigned_work: TassignedWork[];
};

export type Tpayslip = {
    psid: string;
    fk_uid: string;
    status: string;
    paid: number;
    hr: number;
    s_date: string;
    e_date: string;
    archive: boolean;
    company_name: string;
    company_addr: string;
    company_phone: string;
    staff_name: string;
    staff_phone: string;
    staff_email: string;
    staff_addr: string;
    staff_bsb: string;
    staff_acc: string;
    created_date: string;
};

export type TstaffWPayslip = TstaffData & {
    payslips: Tpayslip[];
};

export type TaccumulatedItem = {
    count: number;
    date: string;
};

export type TaccumulatedResult = {
    [year: string]: { [month: string]: number };
};

export type TwlAbstract = {
    wlid: string;
    fk_oid: string;
    fk_uid: string;
    wl_date: string;
    first_name: string;
    last_name: string;
    role: string;
    wl_note: string;
};

export type TorderAbstract = Torder & {
    // table: client
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
};

export type TclientorderWithId = Torder & {
    payments: Tpayment[];
    order_services: Tservice[];
    client_info: TclientData[];
};

export type Tarrangement = {
    order: Partial<TorderAbstract>;
    wl: Partial<TwlAbstract>[];
};

export type TorderArrangement = {
    date: string;
    arrangement: Tarrangement[];
};

export type TnewPayslip = Partical<Tpayslip>;
