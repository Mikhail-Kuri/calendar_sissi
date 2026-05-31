export function getMinFromHours(str) {
    const match = str.match(/(\d+)\s*h\s*(\d+)?/i);

    if (!match) return 0;

    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);

    return hours * 60 + minutes;
}

export function generateSlots(eventId,startDate, endDate, appointmentMinutes = 180, breakMinutes = 15) {
    const slots = [];

    const current = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(current) || isNaN(end)) return [];

    while (current.getTime() + appointmentMinutes * 60000 <= end.getTime()) {

        const appointmentEnd = new Date(
            current.getTime() + appointmentMinutes * 60000
        );

        const startStr = current.toLocaleTimeString("fr-CA", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });

        const endStr = appointmentEnd.toLocaleTimeString("fr-CA", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });

        slots.push({
                eventId,                 
                start: current.toISOString(),
                end: appointmentEnd.toISOString(),
                time_period: `${startStr} - ${endStr}`
        });

        current.setMinutes(
            current.getMinutes() + appointmentMinutes + breakMinutes
        );
    }

    return slots;
}

export function isDayBusy(date, events, duration) {
    if (!date || !events) return false;

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return events.some(event => {
        const start = new Date(event.start);
        const end = new Date(event.end);

        const overlapsDay = start <= dayEnd && end >= dayStart;
        if (!overlapsDay) return false;


        const eventDuration = (end - start) / 60000;

        return eventDuration >= duration;
    });
}