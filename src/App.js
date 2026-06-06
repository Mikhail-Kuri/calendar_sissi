import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarApp from "./Pages/MainPage/CalendarApp";
import MonthlyCalendarWithSlots from "./Pages/CalPage/MonthlyCalendarWithSlots";
import HomePage from "./Pages/MainPage/HomePages/HomePage";
import InstructionPage from "./Pages/InstructionPage/InstructionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarApp />} />
        <Route
          path="/monthly-calendar"
          element={<MonthlyCalendarWithSlots />}
        />
        <Route
          path="/instructions"
          element={<InstructionPage />}
        />

        {/* Ajoutez d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;
