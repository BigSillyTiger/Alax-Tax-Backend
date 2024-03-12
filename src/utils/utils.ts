import bcrypt from "bcrypt";
import { uidPrefix } from "./config";
import { m_uidGetLastStaff } from "../models/staffModel";
import { m_uidGetLastClient } from "../models/clientsModel";
import { m_uidGetLastOrder } from "../models/ordersModel";
import { m_getLastWorkLog, m_wlGetAllWLID } from "../models/workLogModel";
import type { Torder, TstaffData, ToriWorkLog } from "../utils/global";

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

export const formWorkLog = (items: ToriWorkLog[]) => {
    return items.map((item) => {
        const {
            wlid,
            fk_oid,
            fk_uid,
            wl_date,
            s_time,
            e_time,
            b_time,
            wl_status,
            wl_note,
            confirm_status,
            archive,
        } = item;
        return [
            wlid,
            fk_oid,
            fk_uid,
            wl_date,
            s_time,
            e_time,
            b_time,
            wl_status,
            wl_note,
            confirm_status,
            archive,
        ];
    });
};

export const formPayment = (fk_oid: string, items: any) => {
    return items.map((item: any) => {
        return [fk_oid, item.paid, item.paid_date];
    });
};

export const encodePW = async (password: string) => {
    const newPW = await bcrypt.hash(password, 10);
    return newPW;
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
    const today = new Date();
    return `${String(today.getDate()).padStart(2, "0")}${String(
        today.getMonth() + 1
    ).padStart(2, "0")}${today.getFullYear().toString().slice(-2)}`;
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

export const genOrderWithWorkLogs = (
    orders: Torder[],
    workLogs: ToriWorkLog[]
) => {
    return orders.map((order: any) => {
        const workLogsOfOrder = workLogs.filter(
            (log: any) => log.fk_oid === order.oid
        );
        return { ...order, work_logs: workLogsOfOrder };
    });
};

/**
 * @description generate new work log id based on the last work log id
 *  and the current date
 * @param oriWorkLogs
 * @returns
 */
export const genWorkLogsWithNewWLID = async (oriWorkLogs: ToriWorkLog[]) => {
    const ddmmyy = genDate();
    // Filter out items with non-empty wlid
    const itemsWithEmptyWlid = oriWorkLogs.filter((item) => !item.wlid);
    // Generate unique wlid values
    let counter = 1;
    // Record used wlid values
    const usedWlids = new Set(
        oriWorkLogs.map((item) => item.wlid).filter((wlid) => wlid)
    );

    const existingWLIDs = await m_wlGetAllWLID().then(
        (value) => new Set(value.map((item: { wlid: string }) => item.wlid))
    );

    const updatedArray = [...oriWorkLogs];
    for (const item of itemsWithEmptyWlid) {
        let wlid;
        do {
            wlid = `${uidPrefix.workLog}${ddmmyy}${String(counter).padStart(
                3,
                "0"
            )}`;
            counter++;
        } while (existingWLIDs.has(wlid));
        existingWLIDs.add(wlid);

        const index = updatedArray.indexOf(item);
        updatedArray[index] = { ...item, wlid };
    }
    return updatedArray;
};
