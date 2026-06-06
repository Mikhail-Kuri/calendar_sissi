import React, { useState } from "react";
import "./CSS/HomePage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../composant/NAV/Navbar";

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("apropos");

  const tabContent = {
    apropos: (
      <div>
        <h2>Sissi Signature</h2>
        <p>
          <strong>Sissi Signature</strong> est un salon spécialisé dans la mise
          en beauté du regard situé au cœur de Montréal. Fondée par{" "}
          <strong>Sirine</strong>, lash tech certifiée, l’entreprise propose des
          prestations personnalisées en fonction de la forme de vos yeux et de
          votre style.
        </p>
        <p>
          Grâce à l’utilisation de techniques innovantes et de produits de
          qualité, chaque prestation assure confort, tenue optimale et
          valorisation du regard.
        </p>
        <p>
          Offrez-vous une expérience sur mesure et élégante en réservant dès
          maintenant votre rendez-vous chez Cicilsignature, où l’accueil est
          chaleureux et professionnel.
        </p>
      </div>
    ),
    horaire: (
      <div>
        <h2>📅 Disponibilités</h2>
        <p>
          Les disponibilités pour le mois suivant sont publiées chaque{" "}
          <strong>25 du mois</strong>.
        </p>
        <p>Si vous souhaitez prendre un rendez-vous à l'avance...</p>
      </div>
    ),
    contact: (
      <div>
        <h2>📞 Contacts</h2>
        <p>📱 +1 (514) 443 0575</p>
        <p>📧 cicilsignature@gmail.com</p>
      </div>
    ),
  };

  return (
    <div className="homepage">
      <Navbar />
      <header className="hero-section">
        <h1>✨ Sublimez votre regard chez Sissi Signature ✨</h1>
        <button onClick={() => navigate("/calendar")} className="btn-reserver">
          Réserver maintenant
        </button>
      </header>

      <section className="infos-section">
        <div className="infos-columns">
          <div className="description tab-content">{tabContent[activeTab]}</div>

          <div className="infos-side">
            <div
              className={`availability-banner ${activeTab === "apropos" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("apropos")}
              style={{ cursor: "pointer" }}
            >
              <span className="pulse-dot"></span>À propos de Sissi...
            </div>
            <div
              className={`availability-banner ${activeTab === "horaire" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("horaire")}
              style={{ cursor: "pointer" }}
            >
              <span className="pulse-dot"></span>📅 Mon Horaire
            </div>
            <div
              className={`availability-banner ${activeTab === "contact" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("contact")}
              style={{ cursor: "pointer" }}
            >
              <span className="pulse-dot"></span>📞 Mes Contacts
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
