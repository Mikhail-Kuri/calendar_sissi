import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./CSS/MonthlyCalendarWithSlots.css";
import Navbar from "../../composant/NAV/Navbar";
import { SlActionRedo } from "react-icons/sl";
import { SlActionUndo } from "react-icons/sl";
import { isFormValid } from "../../utils/validators";
import { getMonthDays, formatDateLocal } from "../../utils/calendarUtils";
import {
  getMinFromHours,
  generateSlots,
  isDayBusy,
} from "../../utils/slotUtils";
import { useAppointments } from "../../hooks/useAppointments";
import { AvailableSlots } from "../../composant/Pages/AvailableSlots";
import { AppointmentModal } from "../../composant/Pages/AppointmentModal";
import Footer from "../../composant/Footer/footer.jsx";

const MonthlyCalendarWithSlots = () => {
  const location = useLocation();
  const currentLash = location.state || {};
  console.log(currentLash);
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
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const slotsRef = useRef(null);
  const [showTip, setShowTip] = useState(false);

  const [step, setStep] = useState("form");
  const [token, setToken] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    confirmationEmail: "",
    message: "",
    start: "",
    duration: "",
  });

  const formValid = isFormValid(formData);

  const { eventsCache, loadingMonths, loadMonth } = useAppointments(
    getMinFromHours(currentLash.duration),
  );

  useEffect(() => {
    const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);

    loadMonth(currentYear, currentMonth, { force: false });
    void loadMonth(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), {
      force: false,
    });
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
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
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

  function scrollToSlots() {
    requestAnimationFrame(() => {
      slotsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function selectDate(date) {
    if (!date) {
      return false;
    }

    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
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

    return monthEvents.filter((event) => {
      const eventDate = formatDateLocal(new Date(event.start));

      return eventDate === selectedKey && event.transparency === "transparent";
    });
  }

  function buildAvailableSlots(events) {
    return events.flatMap((event) =>
      generateSlots(
        event.id,
        event.start,
        event.end,
        getMinFromHours(currentLash.duration),
        15,
      ),
    );
  }

  const handleRequest = async () => {
    if (!isFormValid(formData)) {
      setErrorMessage("Veuillez remplir correctement le formulaire.");
      return;
    }

    setIsSubmitting(true);
    setModalState("loading");

    try {
      const payload = {
        eventId: formData.start.eventId,
        start: formData.start.start,
        end: formData.start.end,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        service: currentService,
        type: currentType,
        breakMinute: breakMinutes,
      };

      const urlLocalRequest = "http://localhost:5000/appointments/request";
      const urlCodeSpaceRequest =
        "https://glorious-doodle-66jjjvvg7v7h5v9g-5000.app.github.dev/appointments/request";

      const res = await fetch(urlLocalRequest, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setToken(data.token);
      setStep("verify");
      setModalState("idle");
    } catch (err) {
      setErrorMessage("Erreur lors de la demande : " + err.message);
      setModalState("idle");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setErrorMessage("Veuillez entrer le code à 6 chiffres.");
      return;
    }

    setIsSubmitting(true);
    setModalState("loading");

    try {
      const urlLocalConfirm = "http://localhost:5000/appointments/confirm";
      const urlCodeSpaceConfirm =
        "https://glorious-doodle-66jjjvvg7v7h5v9g-5000.app.github.dev/appointments/confirm";

      const res = await fetch(urlLocalConfirm, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, code: verificationCode }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setSelectedDate(null);
      setModalState("success");

      await loadMonth(currentYear, currentMonth, { force: true });
      const next = new Date(currentYear, currentMonth + 1, 1);
      await loadMonth(next.getFullYear(), next.getMonth(), { force: true });

      setTimeout(() => {
        setShowModal(false);
        setModalState("idle");
        setStep("form");
        setToken(null);
        setVerificationCode("");
      }, 2500);

      setFormData({ phone: "", email: "", message: "", start: "" });
    } catch (err) {
      setErrorMessage("Code invalide ou expiré : " + err.message);
      setModalState("idle");
    } finally {
      setIsSubmitting(false);
    }
  };

  function handleAfterSuccses() {}

  function handleDayClick(slot) {
    setFormData((prev) => ({
      ...prev,
      start: slot,
    }));
    console.log(slot);
    setShowModal(true);
  }

  function displayDays(date, idx) {
    const today = new Date();
    const isSelected =
      date && selectedDate?.toDateString() === date.toDateString();
    const isPast =
      (date &&
        date <=
          new Date(today.getFullYear(), today.getMonth(), today.getDate())) ||
      date == null;
    const key = `${currentYear}-${currentMonth}`;
    const monthEvents = eventsCache[key] || [];
    const isLoading = loadingMonths[key];
    const isBusy = !isPast && isDayBusy(date, monthEvents, duration);
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
        <Navbar />

        <header className="cal-hero">
          {/* <div className="cal-hero-tag">
            {currentService === "nails"
              ? "Nail Tech certifiée"
              : "Extensions de cils"}{" "}
            · Sissi Signature
          </div> */}
          <h1>Réservation — {currentType}</h1>
          <p>Sélectionnez une date pour consulter les créneaux disponibles</p>
        </header>
        {/* <div className="parent-container">
          <p className="">Étape 2 sur 3</p>
          <br />
          <p className="">
            Quel type d'extensions vous correspond ?
          </p>
        </div> */}

        <div className="calendar-container">
          <div className="calendar-info-wrapper">
            <button
              className="info-btn"
              onClick={() => setShowTip(!showTip)}
              aria-label="Information sur les disponibilités"
            >
              !
            </button>
            {showTip && (
              <div className="info-tooltip">
                📅 Les disponibilités sont mises à jour le{" "}
                <strong>25 de chaque mois</strong>. Pour un rendez-vous hors
                créneaux, contactez-nous directement.
              </div>
            )}
          </div>

          <div className="calendar-header">
            <button onClick={() => changeMonth(-1)}>
              <SlActionUndo />
            </button>

            <h2>
              {monthNames[currentMonth]} {currentYear}
            </h2>

            <button onClick={() => changeMonth(1)}>
              <SlActionRedo />
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
        <Footer />
      </div>

      {showModal && (
        <AppointmentModal
          modalState={modalState}
          showModal={showModal}
          formData={formData}
          setFormData={setFormData}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          successMessage={successMessage}
          isSubmitting={isSubmitting}
          isFormValid={formValid}
          handleRequest={handleRequest}
          handleConfirm={handleConfirm}
          step={step}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default MonthlyCalendarWithSlots;
