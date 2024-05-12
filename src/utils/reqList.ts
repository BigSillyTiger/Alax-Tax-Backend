export const LOGIN = "/api/adminLogin";
export const LOGOUT = "/api/adminLogout";
export const ADMIN_CHECK = "/api/adminCheck";
export const ACCESS_CHECK = "/api/accessCheck";
export const REGISTER_NEW = "/api/register_new";

export const ROAR = "/api/roars";
export const ROAR_ADMIN = "/api/admin/roars";
export const ROAR_WITH_PICS = "/api/roars/withpics";

export const ROAR_UPLOAD = "/api/pic";
export const PIC = "/api/retrieveimg";
export const CLEAR_UL = "/api/clear/uploadimgs";
export const TEST = "/api/test";

export const HERO_SLIDE_IMG = "/api/api/heroslideimgs";

// Job
export const CLIENT_ALL = "/api/client/all";
export const CLIENT_INFO = "/api/client/info";
export const CLIENT_SINGLE_REGISTER = "/api/client/single-insert";
export const CLIENT_SINGLE_UPDATE = "/api/client/single-update";
export const CLIENT_SINGLE_DEL = "/api/client/single-del";
export const CLIENT_MULTIPLE_INSERT = "/api/client/multiple-insert";
// Job Assignment
export const JOB_ASSIGN = "/api/work/update";
// Work log
export const WL_ALL = "/api/work/all";
export const WL_SIGNLE_UPDATE_H = "/api/work/single-update-hours";
export const WL_SIGNLE_UPDATE_D = "/api/work/single-update-deduction";
export const WL_SINGLE_UPDATE_HND = "/api/work/single-update-hnd"; // hours / note / deduction
export const WL_STATUS = "/api/work/status";
export const WL_SINGLE_DEL = "/api/work/single-del";
export const WL_TODAY = "/api/work/today";
export const WL_TOMORROW = "/api/work/tomorrow";
export const WL_START_TIMER = "/api/work/start-timer";
export const WL_RESET_TIMER = "/api/work/reset-timer";
export const WL_PAUSE_TIMER = "/api/work/pause-timer";
export const WL_RESUME_TIMER = "/api/work/resume-timer";
export const WL_STOP_TIMER = "/api/work/stop-timer";
// Staff
export const STAFF_ALL = "/api/staff/all";
export const STAFF_INFO = "/api/staff/info";
export const STAFF_SINGLE_REGISTER = "/api/staff/single-insert";
export const STAFF_SINGLE_UPDATE = "/api/staff/single-update";
export const STAFF_SINGLE_DEL = "/api/staff/single-del";
export const STAFF_UPDATE_PW = "/api/staff/update-pw";

// Order
export const ORDER_ALL = "/api/order/all";
export const ORDER_ADD = "/api/order/add";
export const ORDER_UPDATE = "/api/order/update";
export const ORDER_DEL = "/api/order/del";
export const ORDER_W_CLIENT = "/api/order/withClientID";
export const ORDER_STATUS = "/api/order/status";
export const PAYMENT_UPDATE = "/api/order/updatePayments";
export const INVOICE_ISSUE_UPDATE = "/api/order/updateInvoiceIssue";
export const ORDER_ALL_ARRANGEMENT = "/api/order/all_arrangement";

// Assist
export const SETTING_UNI_ALL = "/api/setting/uni_all";
export const SETTING_UNI_ADD = "/api/setting/uni_add";
export const SETTING_UNI_DEL = "/api/setting/uni_del";
export const SETTING_UNI_EDIT = "/api/setting/uni_edit";
export const SETTING_GET_COMPANY = "/api/setting/company_get";
export const SETTING_UPDATE_COMPANY = "/api/setting/company_update";
export const SETTING_LOGO_UPDATE = "/api/setting/logo_update";
export const SETTING_LOGO = "/api/setting/logo";

// Payslips
export const PAYSLIP_SINGLE_INSERT = "/api/payslip/single-insert";
export const PAYSLIP_SINGLE_UPDATE = "/api/payslip/single-update";
export const PAYSLIP_SINGLE_DEL = "/api/payslip/single-del";
export const PAYSLIP_SINGLE_ARCHIVE = "/api/payslip/single-archive";
export const PAYSLIP_STATUS_UPDATE = "/api/payslip/status-update";
export const PAYSLIP_ALL = "/api/payslip/all";
export const PAYSLIP_ALL_W_UID = "/api/payslip/all_w_uid";
export const PAYSLIP_BONUS_ALL = "/api/payslip/bonus-all";

// Charts - by month or by week
export const CT_ORDER_PAYMENT = "/api/charts/order-payment";
export const CT_ORDER_UNPAID = "/api/charts/order-unpaid";
export const CT_ORDER_NEW = "/api/charts/order-new";
export const CT_ORDER_UNFINISHED = "/api/charts/order-unfinished";
