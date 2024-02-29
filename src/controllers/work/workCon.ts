import type { Request, Response } from "express";

export const workAdd = async (req: Request, res: Response) => {};

const query2 = `
SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
        'oid', O.oid,
        'fk_cid', O.fk_cid,
        'address', O.address,
        'suburb', O.suburb,
        'city', O.city,
        'state', O.state,
        'country', O.country,
        'postcode', O.postcode,
        'status', O.status,
        'deposit', O.deposit,
        'gst', O.gst,
        'total', O.total,
        'paid', O.paid,
        'created_date', O.created_date,
        'invoice_date', O.invoice_date,
        'order_services', all_services,
        'payments', paymentData,
        'client_info', clientInfo,
        'work_logs', COALESCE(workLogs, JSON_ARRAY())
    )
)
FROM orders O
JOIN (
    SELECT
        cid,
        JSON_OBJECT(
            'cid', c.cid,
            'first_name', c.first_name,
            'last_name', c.last_name
        ) AS clientInfo
    FROM clients c
) C ON O.fk_cid = C.cid
JOIN (
    SELECT 
        fk_oid,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'ranking', ranking,
                'fk_oid', fk_oid,
                'title', title,
                'description', description,
                'qty', qty,
                'unit', unit,
                'taxable', taxable,
                'unit_price', unit_price,
                'gst', gst,
                'netto', netto
            )
        ) AS all_services
    FROM order_services
    GROUP BY fk_oid
) B ON O.oid = B.fk_oid
LEFT JOIN (
    SELECT 
        fk_oid,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'fk_oid', fk_oid,
                'paid', paid,
                'paid_date', paid_date
            )
        ) AS paymentData
    FROM payments
    GROUP BY fk_oid 
) P ON O.oid = P.fk_oid
LEFT JOIN (
    SELECT
        O.oid AS fk_oid,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'fk_oid', logs.fk_oid,
                'wl_date', logs.wl_date,
                'logs', logs.logs_array
            )
        ) AS workLogs
    FROM orders O
    LEFT JOIN (
        SELECT
            wl.fk_oid,
            wl.wl_date,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'wlid', wl.wlid,
                    'fk_uid', wl.fk_uid,
                    'wl_date', wl.wl_date,
                    'e_time', wl.e_time,
                    's_time', wl.s_time,
                    'wl_note', wl.wl_note,
                    'wl_status', wl.wl_status,
                    'confirm_status', wl.confirm_status,
                    'first_name', s.first_name,
                    'last_name', s.last_name,
                    'phone', s.phone,
                    'email', s.email,
                    'role', s.role
                )
            ) AS logs_array
        FROM work_logs wl
        JOIN staff s ON wl.fk_uid = s.uid
        WHERE wl.wl_date != null
        GROUP BY wl.fk_oid, wl.wl_date
    ) AS logs ON logs.fk_oid = O.oid
    GROUP BY O.oid
) W ON O.oid = W.fk_oid;
`;

const result2 = [
    {
        gst: 5.4,
        oid: "J250224001",
        city: "RICHMOND",
        paid: 0.0,
        state: "SA",
        total: 59.4,
        fk_cid: "C0001",
        status: "Pending",
        suburb: "SA",
        address: "4A Bignell Street",
        country: "Australia",
        deposit: 0.0,
        payments: null,
        postcode: "5033",
        work_logs: [{ logs: null, fk_oid: null, wl_date: null }],
        client_info: { cid: "C0001", last_name: "Chen", first_name: "Areos" },
        created_date: "2024-02-25 12:10:27.000000",
        invoice_date: "2024-02-25 12:10:27.000000",
        order_services: [
            {
                gst: 3.2,
                qty: 1,
                unit: "gh",
                netto: 32.0,
                title: "service 2",
                fk_oid: "J250224001",
                ranking: 1,
                taxable: 1,
                unit_price: 32.0,
                description: "",
            },
            {
                gst: 2.2,
                qty: 1,
                unit: "1",
                netto: 22.0,
                title: "service 142",
                fk_oid: "J250224001",
                ranking: 2,
                taxable: 1,
                unit_price: 22.0,
                description: "",
            },
        ],
    },
    {
        gst: 7.8,
        oid: "J250224002",
        city: "RICHMOND",
        paid: 0.0,
        state: "SA",
        total: 85.8,
        fk_cid: "C0001",
        status: "Pending",
        suburb: "SA",
        address: "4A Bignell Street",
        country: "Australia",
        deposit: 0.0,
        payments: null,
        postcode: "5033",
        work_logs: [{ logs: null, fk_oid: null, wl_date: null }],
        client_info: { cid: "C0001", last_name: "Chen", first_name: "Areos" },
        created_date: "2024-02-25 12:10:32.000000",
        invoice_date: "2024-02-25 12:10:32.000000",
        order_services: [
            {
                gst: 7.8,
                qty: 1,
                unit: "jj",
                netto: 78.0,
                title: "serv 143",
                fk_oid: "J250224002",
                ranking: 0,
                taxable: 1,
                unit_price: 78.0,
                description: "",
            },
        ],
    },
    {
        gst: 47.6,
        oid: "J250224003",
        city: "RICHMOND",
        paid: 100.0,
        state: "SA",
        total: 523.6,
        fk_cid: "C0001",
        status: "Pending",
        suburb: "SA",
        address: "4A Bignell Street",
        country: "Australia",
        deposit: 0.0,
        payments: [
            {
                paid: 100.0,
                fk_oid: "J250224003",
                paid_date: "2024-02-24 23:30:00.000000",
            },
        ],
        postcode: "5033",
        work_logs: [{ logs: null, fk_oid: null, wl_date: null }],
        client_info: { cid: "C0001", last_name: "Chen", first_name: "Areos" },
        created_date: "2024-02-25 12:10:41.000000",
        invoice_date: "2024-02-25 12:10:41.000000",
        order_services: [
            {
                gst: 44.4,
                qty: 1,
                unit: "m4",
                netto: 444.0,
                title: "service 44",
                fk_oid: "J250224003",
                ranking: 0,
                taxable: 1,
                unit_price: 444.0,
                description: "",
            },
            {
                gst: 3.2,
                qty: 1,
                unit: "gh",
                netto: 32.0,
                title: "service 2",
                fk_oid: "J250224003",
                ranking: 0,
                taxable: 1,
                unit_price: 32.0,
                description: "",
            },
        ],
    },
    {
        gst: 68.8,
        oid: "J250224004",
        city: "RICHMOND",
        paid: 0.0,
        state: "SA",
        total: 756.8,
        fk_cid: "C0004",
        status: "Pending",
        suburb: "SA",
        address: "4A Bignell Street",
        country: "Australia",
        deposit: 0.0,
        payments: null,
        postcode: "5033",
        work_logs: [{ logs: null, fk_oid: null, wl_date: null }],
        client_info: { cid: "C0004", last_name: "Chen", first_name: "Ar44" },
        created_date: "2024-02-25 12:43:23.000000",
        invoice_date: "2024-02-25 12:43:23.000000",
        order_services: [
            {
                gst: 13.3,
                qty: 1,
                unit: "rr",
                netto: 133.0,
                title: "serv 133",
                fk_oid: "J250224004",
                ranking: 0,
                taxable: 1,
                unit_price: 133.0,
                description: "",
            },
            {
                gst: 44.4,
                qty: 1,
                unit: "m4",
                netto: 444.0,
                title: "service 44",
                fk_oid: "J250224004",
                ranking: 0,
                taxable: 1,
                unit_price: 444.0,
                description: "",
            },
            {
                gst: 11.1,
                qty: 1,
                unit: "m4",
                netto: 111.0,
                title: "service 122",
                fk_oid: "J250224004",
                ranking: 0,
                taxable: 1,
                unit_price: 111.0,
                description: "",
            },
        ],
    },
];

const query3 = `
SELECT 
JSON_ARRAYAGG(
    JSON_OBJECT(
        'logs', logs,
        'fk_oid', fk_oid,
        'wl_date', wl_date
    )
)
FROM (
SELECT 
    fk_oid,
    wl_date,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'wlid', wl.wlid,
            'fk_uid', wl.fk_uid,
            'wl_date', wl.wl_date,
            'e_time', wl.e_time,
            's_time', wl.s_time,
            'wl_note', wl.wl_note,
            'wl_status', wl.wl_status,
            'confirm_status', wl.confirm_status,
            'first_name', s.first_name,
            'last_name', s.last_name,
            'phone', s.phone,
            'email', s.email,
            'role', s.role
        )
    ) AS logs
FROM work_logs wl
JOIN staff s ON wl.fk_uid = s.uid
GROUP BY 
    fk_oid, wl_date
) AS subquery;
`;

const rr = [
    {
        logs: [
            {
                role: "employee",
                wlid: "wl250224001",
                email: "333@gmail.com",
                phone: "+61478697668",
                e_time: null,
                fk_uid: "E001",
                s_time: null,
                wl_date: "2024-02-28",
                wl_note: null,
                last_name: "Chen",
                wl_status: "ongoing",
                first_name: "Areos",
                confirm_status: 0,
            },
            {
                role: "employee",
                wlid: "wl250224002",
                email: "are444@gmail.com",
                phone: "+6147862424558",
                e_time: null,
                fk_uid: "E002",
                s_time: null,
                wl_date: "2024-02-28",
                wl_note: null,
                last_name: "Chen",
                wl_status: "ongoing",
                first_name: "Are44",
                confirm_status: 0,
            },
        ],
        fk_oid: "J250224001",
        wl_date: "2024-02-28",
    },
    {
        logs: [
            {
                role: "employee",
                wlid: "wl260224001",
                email: "333@gmail.com",
                phone: "+61478697668",
                e_time: null,
                fk_uid: "E001",
                s_time: null,
                wl_date: "2024-02-29",
                wl_note: null,
                last_name: "Chen",
                wl_status: "ongoing",
                first_name: "Areos",
                confirm_status: 0,
            },
            {
                role: "employee",
                wlid: "wl260224002",
                email: "are444@gmail.com",
                phone: "+6147862424558",
                e_time: null,
                fk_uid: "E002",
                s_time: null,
                wl_date: "2024-02-29",
                wl_note: null,
                last_name: "Chen",
                wl_status: "ongoing",
                first_name: "Are44",
                confirm_status: 0,
            },
        ],
        fk_oid: "J250224001",
        wl_date: "2024-02-29",
    },
];
