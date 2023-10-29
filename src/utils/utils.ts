export const formOrderDesc = (id: number, items: any) => {
    return items.map((item: any, index: number) => {
        const { title, description, qty, unit, unit_price, gst, netto } = item;
        return [id, title, description, qty, unit, unit_price, gst, netto];
    });
};
