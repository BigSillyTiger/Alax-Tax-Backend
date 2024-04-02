import type { Torder, ToriWorkLog } from "../utils/global";
import { m_psLastPSID } from "../models/payslipsModel";
import { genDate } from "../libs/time";
import { uidPrefix } from "../utils/config";
import { m_wlGetAllWLID } from "../models/workLogModel";
import { m_uidGetLastStaff } from "../models/staffModel";
import { m_clientsLastCID } from "../models/clientsModel";
import { m_ordersLastOID } from "../models/ordersModel";

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

    const existingWLIDs = await m_wlGetAllWLID().then((value) => {
        if (!value) return new Set();
        return new Set(value.map((item) => item.wlid));
    });

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
export const genPSID = async () => {
    try {
        const date = genDate();
        const result = await m_psLastPSID();
        let newId = "001";
        if (result) {
            const dateCmp = date === result[0].oid.slice(1, 7);
            result.length && dateCmp
                ? (newId = String(
                      parseInt(result[0].oid.slice(-3), 10) + 1
                  ).padStart(3, "0"))
                : (newId = "001");
        }
        return `${uidPrefix.payslip}${date}${newId}`;
    } catch (error) {
        return null;
    }
};

/**
 * @description generate order id
 */
export const genOrderId = async () => {
    try {
        const result = await m_ordersLastOID();
        const date = genDate();
        let newId = "001";
        if (result) {
            const dateCmp = date === result[0].oid.slice(1, 7);
            result.length && dateCmp
                ? (newId = String(
                      parseInt(result[0].oid.slice(-3), 10) + 1
                  ).padStart(3, "0"))
                : (newId = "001");
        }
        return `${uidPrefix.order}${date}${newId}`;
    } catch (error) {
        return null;
    }
};

/**
 * @description generate staff uid
 */
export const genStaffUid = async (
    prefix: (typeof uidPrefix)[keyof typeof uidPrefix]
) => {
    const result = await m_uidGetLastStaff(prefix);
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
    const result = await m_clientsLastCID();
    let newId = "";
    result
        ? (newId = String(parseInt(result[0].cid.slice(1), 10) + 1).padStart(
              4,
              "0"
          ))
        : (newId = "0001");
    return `${uidPrefix.client}${newId}`;
};
