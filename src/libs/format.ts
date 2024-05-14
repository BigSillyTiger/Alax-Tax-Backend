import type {
    TaccumulatedItem,
    TnewBonus,
    TnewDeduction,
    TnewStaff,
    Torder,
    TorderAbstract,
    ToriWorkLog,
    Tpayslip,
    TwlAbstract,
} from "../utils/global";
import { m_wlGetAllWLID } from "../models/workLogModel";
import { genDate, genYYYYHHMM } from "./time";
import { MONTHS, uidPrefix } from "../utils/config";
import { plusAB } from "./calculate";

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
        const workLogsOfOrder = workLogs?.length
            ? workLogs.filter((log: any) => log.fk_oid === order.oid)
            : [];
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
        if (!value || !value.length) return new Set();
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
    const {
        fk_uid,
        status,
        hr,
        s_date,
        e_date,
        paid,
        company_name,
        company_addr,
        company_phone,
        staff_name,
        staff_phone,
        staff_email,
        staff_addr,
        staff_bsb,
        staff_acc,
    } = data;
    return [
        psid,
        fk_uid,
        status,
        hr,
        s_date,
        e_date,
        paid,
        company_name,
        company_addr,
        company_phone,
        staff_name,
        staff_phone,
        staff_email,
        staff_addr,
        staff_bsb,
        staff_acc,
    ];
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
        staff.access,
        staff.suburb,
        staff.city,
        staff.state,
        staff.country,
        staff.postcode,
        staff.dashboard,
        staff.clients,
        staff.orders,
        staff.worklogs,
        staff.calendar,
        staff.staff,
        staff.setting,
        staff.hr,
        staff.bsb,
        staff.account,
    ];
};

export const accumulateByMonth = (items: TaccumulatedItem[]) => {
    const monthlyItems: { [year: string]: { [month: string]: number } } = {};

    // Iterate over payments
    for (const item of items) {
        const date = new Date(item.date);
        const year = date.getFullYear().toString();
        const month = date.toLocaleString("en-AU", { month: "long" });

        // Initialize year if not exists
        if (!monthlyItems[year]) {
            monthlyItems[year] = {};
        }

        // Add payment to the corresponding month
        monthlyItems[year][month] = plusAB(
            monthlyItems[year][month] || 0,
            item.count
        );
    }

    // Find the latest year
    const latestYear = Math.max(...Object.keys(monthlyItems).map(Number));

    // Iterate over each year
    for (const year in monthlyItems) {
        const yearData = monthlyItems[year];
        const sortedYearData: { [month: string]: number } = {};

        // Determine the latest month of the current year or the latest year
        const latestMonth =
            parseInt(year) === latestYear ? new Date().getMonth() : 11;

        // Iterate over ordered months
        for (let i = 0; i <= latestMonth; i++) {
            const month = MONTHS[i];
            sortedYearData[month] = yearData[month] || 0;
        }

        // Replace the original year data with the sorted year data
        monthlyItems[year] = sortedYearData;
    }

    return monthlyItems;
};

export const formatOrderArrangement = (
    orders: TorderAbstract[],
    worklogs: TwlAbstract[]
) => {
    if (orders.length === 0 || worklogs.length === 0) {
        return [];
    }

    // Create a map to store arrangement objects
    const arrangementMap = new Map();

    // Iterate over worklogs to populate arrangementMap
    worklogs.forEach((worklog) => {
        const key = `${worklog.wl_date}`;
        if (!arrangementMap.has(key)) {
            arrangementMap.set(key, {
                date: genYYYYHHMM(worklog.wl_date),
                arrangement: [],
            });
        }
        const arrangement = arrangementMap.get(key);

        // Find the corresponding order for the worklog
        const order = orders.find((order) => order.oid === worklog.fk_oid);
        if (!order) {
            return;
        }

        // Create a new wl object
        const wlItem = {
            first_name: worklog.first_name,
            last_name: worklog.last_name,
            fk_uid: worklog.fk_uid,
            role: worklog.role,
            wl_note: worklog.wl_note,
        };

        // Check if an arrangement item for this order already exists
        let arrangementItem = arrangement.arrangement.find(
            (item: any) => item.order.oid === order.oid
        );
        if (!arrangementItem) {
            // If not, create a new arrangement item
            arrangementItem = {
                order: {
                    oid: order.oid,
                    fk_cid: order.fk_cid,
                    first_name: order.first_name,
                    last_name: order.last_name,
                    phone: order.phone,
                    address: order.address,
                    suburb: order.suburb,
                    city: order.city,
                    state: order.state,
                    country: order.country,
                    postcode: order.postcode,
                    status: order.status,
                },
                wl: [],
            };
            arrangement.arrangement.push(arrangementItem);
        }

        // Push the wl object to the corresponding arrangement item
        arrangementItem.wl.push(wlItem);
    });

    // Convert map values to array
    const result = Array.from(arrangementMap.values());
    return result;
};
