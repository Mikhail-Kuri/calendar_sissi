export function AvailableSlots({
    selectedDate,
    availableSlots,
    isSlotUnavailable,
    handleDayClick,
    slotsRef
}) {
    if (!selectedDate) return null;

    return (
        <div className="slots-section" ref={slotsRef}>
            <h3 className="slots-title">
                Disponibilités du{" "}
                {selectedDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                })}
            </h3>

            <div className="slots-list">
                {availableSlots.map((slot) => {
                    const isUnavailable = isSlotUnavailable(slot);

                    return (
                        <button
                            key={slot.id ?? slot.time_period}
                            className={`slot-button ${
                                isUnavailable ? "unavailable" : ""
                            }`}
                            disabled={isUnavailable}
                            onClick={() => handleDayClick(slot)}
                        >
                            {slot.time_period}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default AvailableSlots;