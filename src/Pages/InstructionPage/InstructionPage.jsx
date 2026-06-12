import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../composant/NAV/Navbar";
import "./CSS/InstructionPage.css";

export default function InstructionPage() {
  const navigate = useNavigate();
  const { state: lash } = useLocation();

  return (
    <div className="instruction-page">
      <Navbar />

      <header className="instr-hero">
        <div className="instr-hero-tag">
          {lash?.category ?? "Sissi Signature"}
        </div>
        <h1>{lash?.type}</h1>
        <p>Sélectionnez votre prestation et préparez votre rendez-vous</p>
      </header>

      <section className="instr-body">
        <div className="instr-main-card">
          <div className="instr-meta-badge">
            💰 {lash?.price}$ &nbsp;·&nbsp; ⏱️ {lash?.duration}
          </div>

          <h2>Avant votre rendez-vous</h2>

          <ul className="instr-checklist">
            <li>
              <span className="instr-check">✓</span>Arrivez sans maquillage sur
              les yeux.
            </li>
            <li>
              <span className="instr-check">✓</span>Évitez les produits huileux
              24h avant.
            </li>
            <li>
              <span className="instr-check">✓</span>Prévoyez suffisamment de
              temps pour la pose.
            </li>
            <li>
              <span className="instr-check">✓</span>Un acompte de{" "}
              {lash?.deposit}$ est requis à la réservation.
            </li>
            <li>
              <span className="instr-check">✓</span>Veuillez arriver à l'heure.
            </li>
          </ul>
        </div>

        <aside className="instr-side">
          <div className="side-card">
            <span className="side-card-label">Tarif</span>
            <p className="instr-price-big">{lash?.price}$</p>
            <p className="instr-price-sub">
              Acompte de {lash?.deposit}$ requis
            </p>
          </div>

          <div className="side-card">
            <span className="side-card-label">Disponibilité</span>
            <div className="avail-row">
              <span className="pulse-dot" />
              Ouvert aux réservations
            </div>
          </div>

          <button
            className="instr-continue-btn"
            onClick={() => navigate("/monthly-calendar", { state: lash })}
          >
            Continuer vers le calendrier
          </button>
        </aside>
      </section>
    </div>
  );
}
