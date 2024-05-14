import { Request } from "express";

export type TRequestWithUser = Request & {
    user?: {
        userId: string;
    };
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
}[];

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

export type TorderDesc = {
    fk_oid: string;
    tital: string;
    taxable: boolean;
    description: string;
    qty: number;
    unit: string;
    unit_price: number;
    gst: number;
    netto: number;
}[];

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
    calendar: TpageAccess;
    staff: TpageAccess;
    setting: TpageAccess;
    hr: number;
    bsb: string;
    account: string;
};

export type ToriWorkLog = {
    wlid: string;
    fk_oid: string;
    fk_uid: string;
    wl_date: string;
    s_time: string;
    e_time: string;
    b_time: string;
    b_hour: string;
    wl_status: string;
    wl_note: string;
    confirm_status: boolean;
    archive: boolean;
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
}[];

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

export type TorderDesc = {
    fk_oid: string;
    tital: string;
    taxable: boolean;
    description: string;
    qty: number;
    unit: string;
    unit_price: number;
    gst: number;
    netto: number;
}[];

export type Tpayment = {
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
    worklogs: TpageAccess;
    calendar: TpageAccess;
    staff: TpageAccess;
    setting: TpageAccess;
};

export type TnewStaff = Partical<TstaffData> & {
    pwConfirm: string;
};

export type ToriWorkLog = {
    wlid: string;
    fk_oid: string;
    fk_uid: string;
    wl_date: string;
    s_time: string;
    e_time: string;
    b_time: string;
    b_hour: string;
    wl_status: string;
    confirm_status: boolean;
    archive: boolean;
};

export type TassignedWork = ToriWorkLog & {
    // extra data from staff table
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    role: string;
};

export type TwlUnion = {
    fk_oid: string;
    wl_date: string;
    assigned_work: TassignedWork[];
};

export type Tbonus = {
    fk_psid: string;
    fk_uid: string;
    amount: number;
    note: string;
};

export type Tdeduction = {
    did: string;
    fk_wlid: string;
    amount: number;
    note: string;
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

export type TorderAbstract = {
    oid: string;
    fk_cid: string;
    address: string;
    suburb: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    status: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
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
export type TnewBonus = Partical<Tbonus>;
export type TnewDeduction = Partical<Tdeduction>;
