import bcrypt from "bcrypt";

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

export const formPayment = (fk_client_id: number, items: any) => {
    return items.map((item: any, index: number) => {
        return [fk_client_id, item.paid, item.paid_date];
    });
};

export const encodePW = async (password: string) => {
    const newPW = await bcrypt.hash(password, 10);
    return newPW;
};

export type TstaffData = {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    password: string;
    address: string;
    role: "manager" | "employee";
    suburb: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    dashboard: 0 | 1 | 2;
    clients: 0 | 1 | 2;
    orders: 0 | 1 | 2;
    calendar: 0 | 1 | 2;
    staff: 0 | 1 | 2;
    setting: 0 | 1 | 2;
};

export const replaceStaffPW = (data: TstaffData[]) => {
    return data.map((item) => {
        const newItem = { ...item, password: "" };
        return newItem;
    });
};
