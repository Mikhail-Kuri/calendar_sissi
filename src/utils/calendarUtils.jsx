export function formatDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function toUTCStart(date) {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    return d.toISOString();
}

export function toUTCEnd(date) {
    const d = new Date(date);
    d.setHours(23,59,59,999);
    return d.toISOString();
}

export  function getMonthDays(month,year) {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeekday = (firstDay.getDay() + 6) % 7;

    for (let i = 0; i < firstWeekday; i++) {
        days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }

    return days;
};

export function isPastMonth(year, month) {
    const today = new Date();
    const current = new Date(today.getFullYear(), today.getMonth(), 1);
    const target = new Date(year, month, 1);

    return target < current;
}