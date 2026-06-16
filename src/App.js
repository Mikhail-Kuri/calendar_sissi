import React from "react";
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MonthlyCalendarWithSlots from "./Pages/CalPage/MonthlyCalendarWithSlots";
import HomePage from "./Pages/MainPage/HomePages/HomePage";
import InstructionPage from "./Pages/InstructionPage/InstructionPage";
import EyelashTypeSelector from "./composant/Pages/ServiceSelector";
import NotFoundPage from "./Pages/NotFound/NotFoundPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/selector" element={<EyelashTypeSelector />} />

        <Route path="/selector/lashes" element={<EyelashTypeSelector />} />
        <Route path="/selector/nails" element={<EyelashTypeSelector />} />

        <Route
          path="/monthly-calendar"
          element={<MonthlyCalendarWithSlots />}
        />
        <Route path="/instructions" element={<InstructionPage />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Ajoutez d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;
