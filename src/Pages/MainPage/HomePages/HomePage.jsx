import React, { useState } from "react";
import "./CSS/HomePage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../composant/NAV/Navbar";
import Footer from "../../../composant/Footer/footer";

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("apropos");

  const tabs = [
    { id: "apropos", label: "À propos" },
    { id: "horaire", label: "Horaire" },
  ];

  return (
    <div className="homepage">
      <Navbar />

      {/* ── Hero ── */}
      <header className="hero-section">
        <div className="hero-tag">Sissi Signature · Montréal</div>
        <h1>
          Prendre rendez-vous
          <br />
          chez nous
        </h1>
        <p>Extensions de cils · Nail art · Beauté personnalisée</p>
        <div className="hero-btns">
          <button
            className="btn-reserver"
            onClick={() => navigate("/selector?type=lashes")}
          >
            Prendre rendez-vous avec Sissi
          </button>
        </div>
      </header>

      {/* ── Infos section ── */}
      <section className="infos-section">
        <div>
          <div className="tab-bar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tab-content-card">
            <div
              className={`tab-panel ${activeTab === "apropos" ? "active" : ""}`}
            >
              <h2>Sissi Signature</h2>
              <p>
                <strong>Sissi Signature</strong> est un salon spécialisé dans la
                mise en beauté, situé au cœur de Montréal. Fondé par{" "}
                <strong>Sirine</strong>, lash tech et nail tech certifiée, le
                salon propose des prestations sur mesure pour sublimer votre
                regard et prendre soin de vos ongles.
              </p>
              <p>
                Grâce à des techniques innovantes et des produits de qualité
                professionnelle, chaque soin garantit confort, tenue optimale et
                un résultat naturellement élégant.
              </p>
              <p>
                Un accueil chaleureux vous attend — réservez votre rendez-vous
                dès maintenant.
              </p>
            </div>

            <div
              className={`tab-panel ${activeTab === "horaire" ? "active" : ""}`}
            >
              <h2>Disponibilités</h2>
              <p>
                Les disponibilités pour le mois suivant sont publiées chaque{" "}
                <strong>25 du mois</strong>. Pour planifier à l'avance,
                n'hésitez pas à nous contacter directement.
              </p>
              <p>
                Consultez régulièrement la page ou suivez nos réseaux pour être
                notifié en priorité.
              </p>
            </div>
          </div>
        </div>

        {/* <div className="infos-side">
          <div className="side-card">
            <p className="side-card-label">Disponibilité</p>
            <div className="avail-row">
              <span className="pulse-dot"></span>
              Ouvert aux réservations
            </div>
          </div>
        </div> */}
      </section>

      <Footer />
    </div>
  );
}
