import bcrypt from "bcrypt";
import { uidPrefix } from "./config";
import { m_uidGetLastStaff } from "../models/staffModel";
import { m_uidGetLastClient } from "../models/clientsModel";
import { m_uidGetLastOrder } from "../models/ordersModel";

export const formOrderDesc = (id: number, items: any) => {
    return items.map((item: any, index: number) => {
        const {
            title,
            ranking,
            description,
            qty,
            taxable,
            unit,
            unit_price,
            gst,
            netto,
        } = item;
        return [
            id,
            ranking,
            title,
            description,
            qty,
            taxable,
            unit,
            unit_price,
            gst,
            netto,
        ];
    });
};

export const formPayment = (fk_order_id: string, items: any) => {
    return items.map((item: any) => {
        return [fk_order_id, item.paid, item.paid_date];
    });
};

export const encodePW = async (password: string) => {
    const newPW = await bcrypt.hash(password, 10);
    return newPW;
};

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
    dashboard: 0 | 1 | 2;
    clients: 0 | 1 | 2;
    orders: 0 | 1 | 2;
    calendar: 0 | 1 | 2;
    staff: 0 | 1 | 2;
    setting: 0 | 1 | 2;
};

export const replaceStaffPW = (data: TstaffData[]) => {
    return data.map((item) => {
        const newItem = { ...item, password: "" };
        return newItem;
    });
};

/**
 * @description generate staff uid
 */
export const genStaffUid = async (
    prefix: (typeof uidPrefix)[keyof typeof uidPrefix]
) => {
    const result = await m_uidGetLastStaff(prefix);
    console.log("-> get last staff uid: ", result);
    let newId = "";
    result.length
        ? (newId = String(parseInt(result[0].uid.slice(1), 10) + 1).padStart(
              3,
              "0"
          ))
        : (newId = "001");
    return `${prefix}${newId}`;
};

/**
 * @description generate client uid
 */
export const genClientUid = async () => {
    const result = await m_uidGetLastClient();
    console.log("-> get last client uid: ", result);
    let newId = "";
    result.length
        ? (newId = String(parseInt(result[0].cid.slice(1), 10) + 1).padStart(
              4,
              "0"
          ))
        : (newId = "0001");
    return `${uidPrefix.client}${newId}`;
};

/**
 * @description generate date of 6 digits with format of ddmmyy
 */
const genDate = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(2);
    return day + month + year;
};

/**
 * @description generate order id
 */
export const genOrderId = async () => {
    const result = await m_uidGetLastOrder();
    const date = genDate();
    let newId = "001";
    if (result.length) {
        const dateCmp = date === result[0].oid.slice(1, 7);
        result.length && dateCmp
            ? (newId = String(
                  parseInt(result[0].oid.slice(-3), 10) + 1
              ).padStart(3, "0"))
            : (newId = "001");
    }
    return `${uidPrefix.order}${date}${newId}`;
};
