import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../composant/NAV/Navbar";
import "./CSS/InstructionPage.css";
import Footer from "../../composant/Footer/footer.jsx"

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
            Prix: {lash?.price}$ &nbsp;·&nbsp; Temps: {lash?.duration}
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

          <button
            className="instr-continue-btn"
            onClick={() => navigate("/monthly-calendar", { state: lash })}
          >
            Continuer vers le calendrier
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
