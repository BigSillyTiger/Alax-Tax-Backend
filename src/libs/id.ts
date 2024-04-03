import { m_psLastBID, m_psLastPSID } from "../models/payslipsModel";
import { genDate } from "../libs/time";
import { uidPrefix } from "../utils/config";

import { m_uidGetLastStaff } from "../models/staffModel";
import { m_clientsLastCID } from "../models/clientsModel";
import { m_ordersLastOID } from "../models/ordersModel";

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

export const genDID = async () => {
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
        return `${uidPrefix.deduction}${date}${newId}`;
    } catch (error) {
        return null;
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
