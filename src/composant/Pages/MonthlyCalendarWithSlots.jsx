import React, {useState,useRef,useEffect } from "react";
import { useLocation } from 'react-router-dom';
import "./CSS/MonthlyCalendarWithSlots.css";
import {BackgroundBubbles} from "../Effects/BackgroundEffects/BackgroundBubbles";
import Navbar from "../NAV/Navbar";
import {SlActionRedo} from "react-icons/sl";
import {SlActionUndo} from "react-icons/sl";
import {isFormValid} from "../../utils/validators";
import {isPastMonth,toUTCStart,toUTCEnd,getMonthDays,formatDateLocal} from "../../utils/calendarUtils"
import {getMinFromHours,generateSlots,isDayBusy} from "../../utils/slotUtils"
import {useAppointments} from "../../hooks/useAppointments"
import {AvailableSlots} from "../Pages/AvailableSlots"
import {AppointmentModal} from "../Pages/AppointmentModal"
import e from "cors";

// import FullCalendar from "@fullcalendar/react";


// const slotTemplates = [
//     "09:00 - 11:00",
//     "11:30 - 13:30",
//     "14:00 - 16:00",
//     "16:30 - 18:30"
// ];


const MonthlyCalendarWithSlots = () => {
    const location = useLocation();
    const currentLash = location.state || {};
    const duration = getMinFromHours(currentLash.duration) || 180;
    const breakMinutes = 15;
    const currentService = currentLash.service || "lashes";
    const currentType = currentLash.type || "Classique";
    const deposit = currentLash.deposit || 20;
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
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

    const formValid = isFormValid(formData);

    const {
        eventsCache,
        loadingMonths,
        loadMonth
    } = useAppointments(getMinFromHours(currentLash.duration));

    useEffect(() => {
        const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);

        loadMonth(currentYear, currentMonth);
        void loadMonth(
            nextMonthDate.getFullYear(),
            nextMonthDate.getMonth()
        );
    }, [currentMonth, currentYear, loadMonth]);

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

    const unavailableSlots = {};

    function isSlotUnavailable(slot) {
        if (!selectedDate) return false;
        const dateKey = formatDateLocal(selectedDate);
        return unavailableSlots[dateKey]?.includes(slot);
    }

    function handleDateChange(date) {
        if (!selectDate(date)) {
            return;
        }

        const events = getEventsForDay(date);

        const slots = buildAvailableSlots(events);

        setAvailableSlots(slots);

        scrollToSlots();
    }

    function scrollToSlots(){
         requestAnimationFrame(() => {
            slotsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    }
    
    function selectDate(date) {

        if (!date) {
            return false;
        }

        if (
            selectedDate &&
            date.toDateString() === selectedDate.toDateString()
        ) {
            setSelectedDate(null);
            setAvailableSlots([]);
            return false;
        }

        setSelectedDate(date);
        return true;
    }

    function getEventsForDay(date) {
        const key = `${currentYear}-${currentMonth}`;
        const monthEvents = eventsCache[key] || [];

        const selectedKey = formatDateLocal(date);

        return monthEvents.filter(event => {
            const eventDate = formatDateLocal(
                new Date(event.start)
            );

            return (
                eventDate === selectedKey &&
                event.transparency === "transparent"
            );
        });
    }

    function buildAvailableSlots(events) {
        return events.flatMap(event =>
            generateSlots(
                event.id,
                event.start,
                event.end,
                getMinFromHours(currentLash.duration),
                15
            )
        );
    }

    const handleSubmit = async () => {
        if (!isFormValid(formData)) {
            setErrorMessage("Veuillez remplir correctement le formulaire.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
            eventId: formData.start.eventId,
            start: formData.start.start,
            end: formData.start.end,
            phone: formData.phone,
            email: formData.email,
            message: formData.message,
            service: currentService,
            type: currentType
            };

            const res = await fetch("http://localhost:5000/appointments ", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!data.success) throw new Error(data.message);

            setSuccessMessage("Réservation confirmée 🎉");

            // reset UI
            setFormData({ phone: "", email: "", message: "", start: "" });
            setShowModal(false);

        }
        catch (err) {
            setErrorMessage("Erreur lors de la réservation.");
        } 
        finally {
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
                    <AvailableSlots
                        selectedDate={selectedDate}
                        availableSlots={availableSlots}
                        isSlotUnavailable={isSlotUnavailable}
                        handleDayClick={handleDayClick}
                        slotsRef={slotsRef}
                    />
                )}
            </div>
        </div>

        {/* MODAL */}
        {showModal && (
            <AppointmentModal
                showModal={showModal}
                formData={formData}
                setFormData={setFormData}
                errorMessage={errorMessage}
                successMessage={successMessage}
                isSubmitting={isSubmitting}
                isFormValid={formValid}
                handleSubmit={handleSubmit}
                setShowModal={setShowModal}
            />
        )}
    </>
);
};

export default MonthlyCalendarWithSlots;
