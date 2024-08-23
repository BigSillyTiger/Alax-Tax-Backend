import type {
    TaccumulatedItem,
    TnewStaff,
    Torder,
    TorderAbstract,
    Tpayslip,
    Tservice,
    TwlAbstract,
} from "../utils/global";
import { genYYYYHHMM } from "./time";
import { MONTHS } from "../utils/config";
import { plusAB } from "./calculate";

export const formatOrderService = (
    oid: string,
    cid: string,
    items: any,
    osidArray: string[] = []
) => {
    let i = 0;
    return items.map((item: any) => {
        const {
            osid,
            title,
            ranking,
            qty,
            taxable,
            unit,
            unit_price,
            gst,
            status,
            net,
            created_date,
            service_type,
            product_name,
            note,
        } = item;

        // Use the provided osid if it exists, otherwise use the generated osid from validOsidArray
        const newOsid = osid && osid.length > 0 ? osid : osidArray[i++] ?? null;

        // Use the provided created_date if it exists, otherwise use the current date
        const createdDate = created_date?.length ? created_date : new Date();

        return [
            newOsid,
            cid,
            oid,
            title,
            taxable,
            qty,
            unit,
            unit_price,
            gst,
            net,
            ranking,
            status,
            createdDate,
            service_type,
            product_name,
            note,
        ];
    });
};

export const formatPayment = (pids: string[], fk_oid: string, items: any) => {
    return items.map((item: any, index: number) => {
        return [pids[index], fk_oid, item.paid, item.paid_date];
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
        staff.services,
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

export const formatClientService = (
    cid: string,
    csid: string,
    service: Tservice
) => {
    const {
        title,
        service_type,
        product_name,
        status,
        created_date,
        archive,
        note,
    } = service;

    return [
        csid,
        cid,
        title,
        service_type,
        product_name,
        status,
        created_date,
        "none", // expiry_date,
        archive,
        note,
    ];
};

export const convertToFloat = (x: number): number => {
    // Convert the integer to a string to determine the number of digits
    const xStr = x.toString();
    const numberOfDigits = xStr.length;

    // Calculate the divisor as 10 raised to the power of the number of digits
    const divisor = Math.pow(10, numberOfDigits);

    // Divide the integer by the divisor to get the float
    const result = x / divisor;

    return result;
};
