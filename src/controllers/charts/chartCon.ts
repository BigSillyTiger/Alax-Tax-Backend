import type { Request, Response } from "express";
import { RES_STATUS } from "../../utils/config";
import {
    m_orderAllCount,
    m_orderAllUnpaid,
    m_paymentALL,
} from "../../models/ordersModel";
import { accumulateByMonth } from "../../libs/format";
import { TaccumulatedItem, TaccumulatedResult } from "../../utils/global";
import { genYYYYHHMM } from "../../libs/time";

export const ctAllPayments = async (req: Request, res: Response) => {
    console.log("-> server - chart: AllPayments: ");
    try {
        const [paymentAll, orderAll, unpaidAll] = await Promise.all([
            /* all paid  */
            m_paymentALL().then((res) => {
                if (!res) {
                    return {};
                }
                const result = res.map((item) => ({
                    count: item.paid,
                    date: genYYYYHHMM(item.paid_date),
                }));
                // return { [year: string]: { [month: string]: number } }
                return accumulateByMonth(
                    result as TaccumulatedItem[]
                ) as TaccumulatedResult;
            }),
            /* all order */
            m_orderAllCount().then((res) => {
                if (!res) {
                    return [];
                }
                const result = res.map((item) => ({
                    count: 1,
                    date: genYYYYHHMM(item.created_date),
                }));
                return accumulateByMonth(
                    result as TaccumulatedItem[]
                ) as TaccumulatedResult;
            }),
            /* all unpaid */
            m_orderAllUnpaid().then((res) => {
                if (!res) {
                    return [];
                }
                const result = res.map((item) => ({
                    count: item.unpaid,
                    date: genYYYYHHMM(item.created_date),
                }));
                return accumulateByMonth(
                    result as TaccumulatedItem[]
                ) as TaccumulatedResult;
            }),
        ]);

        const allYearsSet = new Set<string>();
        Object.keys(paymentAll).forEach((year) => allYearsSet.add(year));
        Object.keys(orderAll).forEach((year) => allYearsSet.add(year));
        Object.keys(unpaidAll).forEach((year) => allYearsSet.add(year));

        // Convert the Set back to an array
        const allYears = Array.from(allYearsSet);

        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "Success - Chart data retrieved",
            data: { allYears, paymentAll, orderAll, unpaidAll },
        });
    } catch (error) {
        console.log("-> error: chart: AllPayments: ", error);
        return res.status(500).json({
            status: RES_STATUS.FAILED,
            msg: "Failed to get chart data",
            data: {},
        });
    }
};
