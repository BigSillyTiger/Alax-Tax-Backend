import type {
    Tbonus,
    TnewBonus,
    TnewDeduction,
    TnewStaff,
    Torder,
    ToriWorkLog,
    Tpayslip,
} from "../utils/global";
import { m_wlGetAllWLID } from "../models/workLogModel";
import { genDate } from "./time";
import { uidPrefix } from "../utils/config";

export const formatOrderDesc = (id: number, items: any) => {
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

export const formatWorkLog = (items: ToriWorkLog[]) => {
    return items.map((item) => {
        const {
            wlid,
            fk_oid,
            fk_uid,
            wl_date,
            s_time,
            e_time,
            b_time,
            b_hour,
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
            b_hour,
            wl_status,
            wl_note,
            confirm_status,
            archive,
        ];
    });
};

export const formatPayment = (pids: string[], fk_oid: string, items: any) => {
    return items.map((item: any, index: number) => {
        return [pids[index], fk_oid, item.paid, item.paid_date];
    });
};

export const genOrderWithWorkLogs = (
    orders: Torder[],
    workLogs: ToriWorkLog[]
) => {
    return orders.map((order: any) => {
        const workLogsOfOrder = workLogs.filter(
            (log: any) => log.fk_oid === order.oid
        );
        return { ...order, wlUnion: workLogsOfOrder };
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
    /* const usedWlids = new Set(
        oriWorkLogs.map((item) => item.wlid).filter((wlid) => wlid)
    ); */

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

/**
 *
 * @param psid newly created payslip id
 * @param items contains data for payslip, bonus, deduction
 * @returns data for payslip table
 *          data for bonus table
 *          data for deduction table
 */
export const formatPayslip = (psid: string, data: Partial<Tpayslip>) => {
    const { fk_uid, status, hr, s_date, e_date, paid } = data;
    return [psid, fk_uid, status, hr, s_date, e_date, paid];
};

export const formatBonus = (psid: string, uid: string, data: TnewBonus[]) => {
    return data.map((item: TnewBonus) => {
        const { note, amount } = item;
        return [psid, uid, note, amount];
    });
};

export const formatDeduction = (
    did: string[],
    wlid: string,
    items: TnewDeduction[]
) => {
    return items.map((item: TnewDeduction, index) => {
        const { amount, note } = item;
        return [did[index], wlid, amount, note];
    });
};

export const formatStaff = (uid: string, pw: string, staff: TnewStaff) => {
    return [
        uid,
        staff.first_name,
        staff.last_name,
        staff.phone,
        staff.email,
        pw,
        staff.address,
        staff.role,
        staff.suburb,
        staff.city,
        staff.state,
        staff.country,
        staff.postcode,
        staff.dashboard,
        staff.clients,
        staff.orders,
        staff.calendar,
        staff.staff,
        staff.setting,
        staff.hr,
        staff.bsb,
        staff.account,
    ];
};
