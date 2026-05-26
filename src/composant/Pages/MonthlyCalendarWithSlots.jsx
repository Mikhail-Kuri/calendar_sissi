import React, {useState,useRef,useEffect } from "react";
import { useLocation } from 'react-router-dom';
import "./CSS/MonthlyCalendarWithSlots.css";
import {BackgroundBubbles} from "../Effects/BackgroundEffects/BackgroundBubbles";
import Navbar from "../NAV/Navbar"; // Assurez-vous d'avoir ce fichier CSS pour le style
import {SlActionRedo} from "react-icons/sl";
import {SlActionUndo} from "react-icons/sl";
import { fetchAppointments } from "../../services/fetcher/fetchAppointments";
import {formatPhoneNumber, isValidEmail, isValidPhone} from "../../utils/validators";
import e from "cors";


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

function getMinFromHours(str) {
    const match = str.match(/(\d+)\s*h\s*(\d+)?/i);

    if (!match) return 0;

    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);

    return hours * 60 + minutes;
}



const MonthlyCalendarWithSlots = () => {
    const location = useLocation();
    const currentLash = location.state || {};
    const duration = getMinFromHours(currentLash.duration) || 180;
    const breakMinutes = 15;
    const currentService = currentLash.service || "lashes";
    const currentType = currentLash.type || "Classique";
    const deposit = currentLash.deposit || 20;
    const [eventsCache, setEventsCache] = useState({});
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loadingMonths, setLoadingMonths] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const slotsRef = useRef(null);


    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        message: '',
        start: '',
        duration: ''
    });

    function isFormValid() {
        return (
            formData.phone.trim().length > 0 &&
            formData.email.trim().length > 0 &&
            isValidEmail(formData.email) &&
            isValidPhone(formData.phone)
        );
    }

    function isPastMonth(year, month) {
        const today = new Date();
        const current = new Date(today.getFullYear(), today.getMonth(), 1);
        const target = new Date(year, month, 1);

        return target < current;
    }

    useEffect(() => {


        const loadMonth = async (year, month) => {
            const key = `${year}-${month}`;

            if (isPastMonth(year, month)) {
                console.log("⛔ mois passé ignoré:", key);
                return;
            }

            if (eventsCache[key] || loadingMonths[key]) return;

            setLoadingMonths(prev => ({
                ...prev,
                [key]: true
            }));

            try {
                const start = new Date(year, month, 1);
                const end = new Date(year, month + 1, 0);
                const duration = getMinFromHours(currentLash.duration)

                const events = await fetchAppointments(
                    toUTCStart(start),
                    toUTCEnd(end),
                    duration
                );

                

                setEventsCache(prev => ({
                    ...prev,
                    [key]: events
                }));
            
            }
            finally {
                setLoadingMonths(prev => ({
                    ...prev,
                    [key]: false
                }));
            }
        };

        const currentKey = `${currentYear}-${currentMonth}`;

        const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
        const nextYear = nextMonthDate.getFullYear();
        const nextMonth = nextMonthDate.getMonth();

        const nextKey = `${nextYear}-${nextMonth}`;

        const load = async () => {
            // mois courant
            await loadMonth(currentYear, currentMonth);

            // mois suivant (prefetch en background)
            loadMonth(nextYear, nextMonth);
        };

        load();
    }, [currentMonth, currentYear]);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showModal]);

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

    function generateSlots(eventId,startDate, endDate, appointmentMinutes = 180, breakMinutes = 15) {
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
                   eventId,                 // 👈 Lien direct avec l'event
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
                event.id,
                event.start,
                event.end,
                getMinFromHours(currentLash.duration),
                15
            );

            generatedSlots = [...generatedSlots, ...slots];
        });

        setAvailableSlots(generatedSlots);
        requestAnimationFrame(() => {
            slotsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    }

    const handleSubmit = async () => {
        if (!isFormValid()) {
            setErrorMessage("Veuillez remplir correctement le formulaire.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const payload = {
                date: formatDateLocal(selectedDate),
                phone: formData.phone,
                email: formData.email,
                message: formData.message,
                service: currentService,
                type: currentType,
                duration: duration,
                breakMinutes: breakMinutes,
                deposit: deposit,
                eventId: formData.start.eventId,
                end: formData.start.end,
                start: formData.start.start
            };

            console.log("RÉSERVATION :", payload);

            // 🔥 ICI plus tard POST backend
            // await fetch("/api/reservation", { method: "POST", body: JSON.stringify(payload) })

            await new Promise(res => setTimeout(res, 800)); // simulation API

            setSuccessMessage("Réservation confirmée 🎉");

            await new Promise(res => setTimeout(res, 1000))

            setSuccessMessage(null);
            // reset form
            setFormData({
                phone: "",
                email: "",
                message: "",
                start: ""
            });

            setShowModal(false);
            setSelectedDate(null);
            setAvailableSlots([]);

        } catch (err) {
            console.error(err);
            setErrorMessage("Erreur lors de la réservation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    function handleDayClick(slot) {
        setFormData(prev => ({
            ...prev,
            start: slot
        }));
        console.log(slot)
        setShowModal(true);
    }

    function isDayBusy(date, events, duration) {
        if (!date || !events) return false;

        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        return events.some(event => {
            const start = new Date(event.start);
            const end = new Date(event.end);

            // vérifier que l'event touche la journée
            const overlapsDay = start <= dayEnd && end >= dayStart;
            if (!overlapsDay) return false;

            // durée réelle de l'event en minutes
            const eventDuration = (end - start) / 60000;

            // 👇 ta règle métier
            return eventDuration >= duration;
        });
    }


    function displayDays(date, idx) {
        const today = new Date();
        const isSelected = date && selectedDate?.toDateString() === date.toDateString();
        const isPast = date && date <= new Date(today.getFullYear(), today.getMonth(), today.getDate()) || date == null ;
        const key = `${currentYear}-${currentMonth}`;
        const monthEvents = eventsCache[key] || [];
        const isLoading = loadingMonths[key];
        const isBusy = !isPast && isDayBusy(date, monthEvents,duration);
        const isClickable = !isPast && date && !isLoading && isBusy;



        return (
            <div
                key={idx}
                className={`day-cell
                    ${!date ? "empty" : ""}
                    ${isSelected ? "selected" : ""}
                    ${isPast ? "past" : ""}
                    ${isLoading ? "loading" : ""}
                    ${!isLoading && isBusy ? "available" : ""}
                    ${!isLoading && !isBusy ? "busy" : ""}
                `}

                onClick={() => {
                    if (isClickable) handleDateChange(date);
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
                            {availableSlots.map((slot, index) => {
                                const isUnavailable = isSlotUnavailable(slot);

                                return (
                                    <button
                                        key={index}
                                        className={`slot-button ${isUnavailable ? "unavailable" : ""}`}
                                        disabled={isUnavailable}
                                        onClick={() => handleDayClick(slot)}
                                    >
                                        {slot.time_period}
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

                    {errorMessage && (
                        <p style={{ color: "red", marginTop: "10px" }}>
                            {errorMessage}
                        </p>
                    )}

                    {successMessage && (
                        <p style={{ color: "green", marginTop: "10px" }}>
                            {successMessage}
                        </p>
                    )}

                    <div className="modalActions">

                        <button
                            className="button"
                            onClick={() => setShowModal(false)}
                        >
                            Annuler
                        </button>

                        <button
                            className="button"
                            disabled={!isFormValid() || isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? "Confirmation..." : "Réserver"}
                        </button>

                    </div>
                </div>
            </div>
        )}
    </>
);
};

export default MonthlyCalendarWithSlots;
