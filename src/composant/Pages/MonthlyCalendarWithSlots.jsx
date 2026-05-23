import React, {useState,useRef,useEffect} from "react";
import "./CSS/MonthlyCalendarWithSlots.css";
import {BackgroundBubbles} from "../Effects/BackgroundEffects/BackgroundBubbles";
import Navbar from "../NAV/Navbar"; // Assurez-vous d'avoir ce fichier CSS pour le style
import {SlActionRedo} from "react-icons/sl";
import {SlActionUndo} from "react-icons/sl";
import { fetchAppointments } from "../../services/fetcher/fetchAppointments";
import {formatPhoneNumber, isValidEmail, isValidPhone} from "../../utils/validators";


const slotTemplates = [
    "09:00 - 11:00",
    "11:30 - 13:30",
    "14:00 - 16:00",
    "16:30 - 18:30"
];

function toUTCStart(date) {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    return d.toISOString();
}

function toUTCEnd(date) {
    const d = new Date(date);
    d.setHours(23,59,59,999);
    return d.toISOString();
}

function formatDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}



const MonthlyCalendarWithSlots = () => {
    const [eventsCache, setEventsCache] = useState({});
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);


    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        message: '',
        start: ''
    });

    useEffect(() => {
        const key = `${currentYear}-${currentMonth}`;

        const load = async () => {
            if (eventsCache[key]) {
                console.log("cache utilisé");
                return;
            }

            const start = new Date(currentYear, currentMonth, 1);
            const end = new Date(currentYear, currentMonth + 1, 0);

            const events = await fetchAppointments(
                toUTCStart(start),
                toUTCEnd(end)
            );


            setEventsCache(prev => ({
                ...prev,
                [key]: events
            }));
        };

        load();
    }, [currentMonth, currentYear]);

    const getMonthDays = (month, year) => {
        const days = [];
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstWeekday = (firstDay.getDay() + 6) % 7; // Lundi = 0

        // Ajout des jours vides pour aligner
        for (let i = 0; i < firstWeekday; i++) {
            days.push(null);
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentYear, currentMonth + offset);
        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());
        setSelectedDate(null);
        setAvailableSlots([]);
    };

    function generateSlots(startDate, endDate, appointmentMinutes = 60, breakMinutes = 15) {
        const slots = [];

        const current = new Date(startDate);
        const end = new Date(endDate);

        while (true) {

            // Heure de fin du rendez-vous
            const appointmentEnd = new Date(
                current.getTime() + appointmentMinutes * 60000
            );

            // Si le rendez-vous dépasse la disponibilité → stop
            if (appointmentEnd > end) break;

            // Formatter les heures
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

            // Ajouter le slot
            slots.push(`${startStr} - ${endStr}`);

            // Avancer avec le buffer
            current.setMinutes(
                current.getMinutes() + appointmentMinutes + breakMinutes
            );
        }

        return slots;
    }

    const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];



    const calendarDays = getMonthDays(currentMonth, currentYear);

    const unavailableSlots = {
            "2026-05-25": ["11:30 - 13:30", "16:30 - 18:30"],
            "2026-05-26": ["09:00 - 11:00"]
        };


    function isSlotUnavailable(slot) {
        if (!selectedDate) return false;

        const dateKey = formatDateLocal(selectedDate);
        return unavailableSlots[dateKey]?.includes(slot);
    }

    function handleDateChange(date) {

        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            setSelectedDate(null);
            setAvailableSlots([]);
            return;
        }

        if (!date) return;

        setSelectedDate(date);
        setAvailableSlots(slotTemplates)

        const key = `${currentYear}-${currentMonth}`;
        const monthEvents = eventsCache[key] || [];

        const selectedKey = formatDateLocal(date);

        const selectedEvents = monthEvents.filter(event => {
            const eventDate = formatDateLocal(new Date(event.start));

            return (
                eventDate === selectedKey &&
                event.transparency === "transparent"
            );
        });

        console.log("Events du jour :", selectedEvents);

        let generatedSlots = [];

        selectedEvents.forEach(event => {

            const slots = generateSlots(
                event.start,
                event.end,
                60,
                15
            );

            generatedSlots = [...generatedSlots, ...slots];
        });

        setAvailableSlots(generatedSlots);
    }

    const handleSubmit = () => {
        console.log("RÉSERVATION :");

        console.log({
            date: formatDateLocal(selectedDate),
            timeSlot: formData.start,
            phone: formData.phone,
            email: formData.email,
            message: formData.message
        });
    };

    function displayDays(date, idx) {
        const today = new Date();
        const isSelected = date && selectedDate?.toDateString() === date.toDateString();
        const isPast = date && date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return (
            <div
                key={idx}
                className={`day-cell 
                                ${isSelected ? "selected" : ""} 
                                ${isPast ? "past" : "future"}`}
                onClick={() => {
                    if (!isPast && date) handleDateChange(date);
                }}
            >
                {date ? date.getDate() : ""}
            </div>
        );
    }

return (
    <>
        <div>
            <Navbar/>
            <BackgroundBubbles/>

            <div className="calendar-header-header">
                <h1>Réservation de rendez-vous</h1>
                <p>Sélectionnez une date pour consulter les créneaux disponibles</p>
            </div>

            <div className="calendar-container">

                {/* Navigation mois */}
                <div className="calendar-header">
                    <button onClick={() => changeMonth(-1)}>
                        <SlActionUndo/>
                    </button>

                    <h2>
                        {monthNames[currentMonth]} {currentYear}
                    </h2>

                    <button onClick={() => changeMonth(1)}>
                        <SlActionRedo/>
                    </button>
                </div>

                {/* Grille */}
                <div className="calendar-grid">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="day-name">
                            {day}
                        </div>
                    ))}

                    {calendarDays.map((date, idx) => {
                        return displayDays(date, idx);
                    })}
                </div>

                {/* Créneaux */}
                {selectedDate && (
                    <div className="slots-section">
                        <h3 className="slots-title">
                            Disponibilités du{" "}
                            {selectedDate.toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long"
                            })}
                        </h3>

                        <div className="slots-list">
                            {availableSlots.map((slot, index) => {
                                const isUnavailable = isSlotUnavailable(slot);

                                return (
                                    <button
                                        key={index}
                                        className={`slot-button ${
                                            isUnavailable ? "unavailable" : ""
                                        }`}
                                        disabled={isUnavailable}
                                        onClick={() => {
                                            setFormData({
                                                ...formData,
                                                start: slot
                                            });


                                            setShowModal(true);
                                        }}
                                    >
                                        {slot}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* MODAL */}
        {showModal && (
            <div className="modalOverlay">
                <div className="modalContent">

                    <h2 className="modalTitle">
                        📌 Informations du rendez-vous
                    </h2>

                    <label>Numéro de téléphone *</label>

                    <input
                        type="text"
                        className="input"
                        placeholder="(514) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                phone: formatPhoneNumber(e.target.value)
                            })
                        }
                    />

                    <label>Email *</label>

                    <input
                        type="email"
                        className="input"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                email: e.target.value
                            })
                        }
                    />

                    <label>Message (optionnel)</label>

                    <textarea
                        className="textarea"
                        value={formData.message}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                message: e.target.value
                            })
                        }
                    />

                    <div className="modalActions">

                        <button
                            className="button"
                            onClick={() => setShowModal(false)}
                        >
                            Annuler
                        </button>

                        <button
                            className="button"
//                             disabled={
//                                 !formData.phone.trim() ||
//                                 !formData.email.trim()
//                             }
                            onClick={handleSubmit}
                        >
                            Réserver
                        </button>

                    </div>
                </div>
            </div>
        )}
    </>
);
};

export default MonthlyCalendarWithSlots;
