import React, {useState,useRef,useEffect} from "react";
import "./CSS/MonthlyCalendarWithSlots.css";
import {BackgroundBubbles} from "../Effects/BackgroundEffects/BackgroundBubbles";
import Navbar from "../NAV/Navbar"; // Assurez-vous d'avoir ce fichier CSS pour le style
import {SlActionRedo} from "react-icons/sl";
import {SlActionUndo} from "react-icons/sl";
import { fetchAppointments } from "../../services/fetcher/fetchAppointments";

const slotTemplates = [
    "09:00 - 11:00",
    "11:30 - 13:30",
    "14:00 - 16:00",
    "16:30 - 18:30"
];



const MonthlyCalendarWithSlots = () => {
    const [eventsCache, setEventsCache] = useState({});
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);

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
                start.toISOString(),
                end.toISOString()
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

        const dateKey = selectedDate.toISOString().split("T")[0];

        return unavailableSlots[dateKey]?.includes(slot);
    }

    function handleDateChange(date) {
        if (date && selectedDate?.toDateString() === date.toDateString()) {
            setSelectedDate(null);
            setAvailableSlots([]);
        }
        if (date && selectedDate?.toDateString() !== date.toDateString()) {
            setSelectedDate(date);
            setAvailableSlots(slotTemplates);
        }
    }

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
                    <button onClick={() => changeMonth(-1)}><SlActionUndo/></button>
                    <h2>{monthNames[currentMonth]} {currentYear}</h2>
                    <button onClick={() => changeMonth(1)}><SlActionRedo/></button>
                </div>

                {/* Grille des jours */}
                <div className="calendar-grid">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="day-name">{day}</div>
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
                                        className={`slot-button ${isUnavailable ? "unavailable" : ""}`}
                                        disabled={isUnavailable}
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
    );
};

export default MonthlyCalendarWithSlots;
