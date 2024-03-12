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
    role: "manager" | "employee";
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
};

export type ToriWorkLog = {
    wlid: string;
    fk_oid: string;
    fk_uid: string;
    wl_date: string;
    s_time: string;
    e_time: string;
    b_time: string;
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
    wl_note: string;
    wl_status: string;
    confirm_status: boolean;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    role: string;
};

export type TworkLog = {
    fk_oid: string;
    wl_date: string;
    assigned_work: TassignedWork[];
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
    role: "manager" | "employee";
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
};

export type ToriWorkLog = {
    wlid: string;
    fk_oid: string;
    fk_uid: string;
    wl_date: string;
    s_time: string;
    e_time: string;
    b_time: string;
    wl_status: string;
    wl_note: string;
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

export type TworkLog = {
    fk_oid: string;
    wl_date: string;
    assigned_work: TassignedWork[];
};
