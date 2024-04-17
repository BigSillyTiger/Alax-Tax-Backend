export const genHHMM = (...args: any[]) => {
    if (args.length === 1 && args[0] instanceof Date) {
        const hours = String(args[0].getHours()).padStart(2, "0");
        const minutes = String(args[0].getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    } else if (
        args.length === 2 &&
        typeof args[0] === "number" &&
        typeof args[1] === "number"
    ) {
        const hours = String(args[0]).padStart(2, "0");
        const minutes = String(args[1]).padStart(2, "0");
        return `${hours}:${minutes}`;
    } else if (args.length === 1 && typeof args[0] === "string") {
        // Parse the formatted date string
        const parts = args[0].split(", ");

        // Extract time part
        const [, , timePart] = parts;
        const [hour, minute] = timePart.split(":");

        // Form the hh:mm format
        return `${hour}:${minute}`;
    }
};

/**
 * @description generate date of 6 digits with format of ddmmyy
 * @param day
 *          - 0 : today by default
 *          - plus: future days
 *          - minus: past days
 * @returns date of format dd/mm/yyyy
 */
export const genAUDate = (day: number = 0) => {
    const dateOptionADL: Intl.DateTimeFormatOptions = {
        timeZone: "Australia/Adelaide",
        hour12: false,
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };

    const currentDate = new Date();
    const targetDate = new Date(
        currentDate.getTime() + day * 24 * 60 * 60 * 1000
    );
    return targetDate.toLocaleString("en-AU", dateOptionADL);
};

export const genYYYYHHMM = (date: string) => {
    const parts = date.split(", ");

    // Extract day, month, and year
    const [, datePart] = parts;
    const [day, month, year] = datePart.split("/");

    // Rearrange the date parts in yyyy-mm-dd format
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export const calBreakTime = (sTime: string, eTime: string, bHour: string) => {
    sTime = sTime ?? "00:00";
    eTime = eTime ?? "00:00";
    bHour = bHour ?? "00:00";
    // Parse start time
    const [startHour, startMinute] = sTime.split(":").map(Number);
    // Parse end time
    const [endHour, endMinute] = eTime.split(":").map(Number);
    // Parse break time
    const [breakHour, breakMinute] = bHour.split(":").map(Number);

    // Convert time strings to total minutes
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const breakTotalMinutes = breakHour * 60 + breakMinute;

    // Calculate total work time in minutes
    let totalWorkMinutes =
        endTotalMinutes - startTotalMinutes + breakTotalMinutes;

    // Handle cases where the break time is longer than the work time
    if (totalWorkMinutes < 0) {
        totalWorkMinutes = 0;
    }

    // Convert total break time back to hh:mm format
    const hour = Math.floor(totalWorkMinutes / 60);
    const minute = totalWorkMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
};

/**
 * @description generate date of 6 digits with format of ddmmyy
 */
export const genDate = () => {
    const parts = genAUDate().split(", ");
    // Extract day, month, and year
    const [, datePart] = parts;
    const [day, month, year] = datePart.split("/");
    // Rearrange the date parts in ddmmyy format
    return `${day}${month}${year.slice(2)}`;
};
