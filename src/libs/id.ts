import { m_psLastBID, m_psLastPSID } from "../models/payslipsModel";
import { genDate } from "../libs/time";
import { uidPrefix } from "../utils/config";

import { m_uidGetLastStaff } from "../models/staffModel";
import { m_clientsLastCID } from "../models/clientsModel";
import { m_ordersLastOID } from "../models/ordersModel";
import { m_deductLastDID } from "../models/workLogModel";

export const genPSID = async () => {
    try {
        const date = genDate();
        const result = await m_psLastPSID();
        let newId = "001";
        if (result) {
            const dateCmp = date === result[0].oid.slice(2, 8);
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

export const genBID = async () => {
    try {
        const result = await m_psLastBID();
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
 * @description generate multiple beduction id
 * @returns
 */
export const genDID = async (count: number) => {
    try {
        let ids = [];
        let currentNumber = 1;
        const currentDate = genDate();
        const lastId = await m_deductLastDID();

        if (lastId?.length) {
            const lastIdDate = lastId[0].substring(1, 7);
            currentNumber = parseInt(lastId[0].substring(7), 10);

            if (lastIdDate === currentDate) {
                currentNumber++;
            } else {
                currentNumber = 1;
            }
        }

        for (let i = 0; i < count; i++) {
            let number = (currentNumber + i).toString().padStart(3, "0");
            ids.push(`${uidPrefix.deduction}${currentDate}${number}`);
        }

        return ids;
    } catch (error) {
        throw new Error("Error generating deduction id");
    }
};

/**
 * @description generate order id
 */
export const genOID = async () => {
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
export const genUID = async (
    prefix: (typeof uidPrefix)[keyof typeof uidPrefix]
) => {
    const result = await m_uidGetLastStaff(prefix);
    let newId = "";
    result
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
