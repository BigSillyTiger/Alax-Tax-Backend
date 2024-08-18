import { payslip_lastBid, payslip_lastPsid } from "../models/payslipsModel";
import { genDate } from "../libs/time";
import { uidPrefix } from "../utils/config";

import { staff_lastUid } from "../models/staffModel";
import { client_lastCid } from "../models/clientsModel";
import {
    order_lastOid,
    order_lastOsid,
    order_lastPid,
} from "../models/ordersModel";

export const genPSID = async () => {
    try {
        const date = genDate();
        const lastPsid = await payslip_lastPsid();
        let newId = "001";
        if (lastPsid?.length) {
            const dateCmp = date === lastPsid[0].psid.slice(2, 8);
            lastPsid.length && dateCmp
                ? (newId = String(
                      parseInt(lastPsid[0].psid.slice(-3), 10) + 1
                  ).padStart(3, "0"))
                : (newId = "001");
        }
        return `${uidPrefix.payslip}${date}${newId}`;
    } catch (error) {
        console.log("-> error - genPSID: ", error);
        return null;
    }
};

export const genPID = async (count: number) => {
    try {
        let ids = [];
        let currentNumber = 1;
        const currentDate = genDate();
        const lastId = await order_lastPid();

        if (lastId?.length) {
            const lastIdDate = lastId[0].pid.substring(1, 7);
            currentNumber = parseInt(lastId[0].pid.substring(7), 10);

            if (lastIdDate === currentDate) {
                currentNumber++;
            } else {
                currentNumber = 1;
            }
        }

        for (let i = 0; i < count; i++) {
            let number = (currentNumber + i).toString().padStart(3, "0");
            ids.push(`${uidPrefix.payment}${currentDate}${number}`);
        }

        return ids;
    } catch (error) {
        console.log("-> error - genPID: ", error);
        throw new Error("Error generating payment id");
    }
};

export const genBID = async () => {
    try {
        const result = await payslip_lastBid();
        let newId = "001";
        const date = genDate();
        if (result) {
            const dateCmp = date === result[0].oid.slice(1, 7);
            result.length && dateCmp
                ? (newId = String(
                      parseInt(result[0].oid.slice(-3), 10) + 1
                  ).padStart(3, "0"))
                : (newId = "001");
        }
        return `${uidPrefix.bonus}${date}${newId}`;
    } catch (error) {
        return null;
    }
};

/**
 * @description generate order id
 */
export const genOID = async () => {
    try {
        const result = await order_lastOid();
        const date = genDate();
        let newId = "001";
        if (result && result.length) {
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
 * @description generate order id
 * @param num number of order service id to generate
 */
export const genOSID = async (num: number) => {
    try {
        const result = await order_lastOsid();
        const date = genDate();
        let newIds: string[] = [];
        let newIdNum = 1;

        if (result && result.length) {
            const dateCmp = date === result[0].osid.slice(2, 8);
            if (dateCmp) {
                newIdNum = parseInt(result[0].osid.slice(-3), 10) + 1;
            }
        }

        for (let i = 0; i < num; i++) {
            const newId = String(newIdNum + i).padStart(3, "0");
            newIds.push(`${uidPrefix.orderService}${date}${newId}`);
        }

        return newIds;
    } catch (error) {
        return null;
    }
};

/**
 * @description generate staff uid
 */
export const genUID = async (
    prefix: (typeof uidPrefix)[keyof typeof uidPrefix]
) => {
    const result = await staff_lastUid(prefix);
    let newId = "";
    result?.length
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
export const genCID = async () => {
    const result = await client_lastCid();
    let newId = "";
    result && result.length
        ? (newId = String(parseInt(result[0].cid.slice(1), 10) + 1).padStart(
              4,
              "0"
          ))
        : (newId = "0001");
    return `${uidPrefix.client}${newId}`;
};

export const genCSID = async (num: number) => {};
