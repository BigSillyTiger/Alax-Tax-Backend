import type { Request, Response } from "express";
import { RES_STATUS } from "../../utils/config";
import { m_paymentALL } from "../../models/ordersModel";
import { accumulatePaymentsByMonth } from "../../libs/format";
import { TpaymentAll } from "../../utils/global";
import { genYYYYHHMM } from "../../libs/time";

export const ctAllPayments = async (req: Request, res: Response) => {
    console.log("-> server - chart: AllPayments: ");
    try {
        const allPayments = await m_paymentALL().then((res) => {
            if (!res || (res && !res.length)) {
                return {};
            }
            const result = res.map((item) => ({
                paid: item.paid,
                paid_date: genYYYYHHMM(item.paid_date),
            }));
            // { [year: string]: { [month: string]: number } }
            return accumulatePaymentsByMonth(result as TpaymentAll[]);
        });

        //const unit = req.query.unit; // m = month or w = week
        //const result = accumulatePaymentsByMonth(allPayments as TpaymentAll[]);

        return res.status(200).json({
            status: RES_STATUS.SUCCESS,
            msg: "Success - Chart data retrieved",
            data: allPayments,
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
