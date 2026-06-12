import { useNavigate } from "react-router-dom";
import Navbar from "../../composant/NAV/Navbar";
import "./CSS/NotFoundPage.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <Navbar />

      <header className="notfound-hero">
        <div className="notfound-hero-tag">Erreur 404 · Sissi Signature</div>
        <h1>Page introuvable</h1>
        <p>Cette page n'existe pas ou a été déplacée.</p>
      </header>

      <section className="notfound-body">
        <div className="notfound-main-card">
          <div className="notfound-code">404</div>
          <h2>Oups, vous êtes perdue !</h2>
          <p>
            La page que vous cherchez n'existe pas. Elle a peut-être été
            déplacée, supprimée, ou l'adresse est incorrecte.
          </p>

          <div className="notfound-actions">
            <button
              className="notfound-btn-primary"
              onClick={() => navigate("/")}
            >
              Retour à l'accueil
            </button>
            {/* <button
              className="notfound-btn-secondary"
              onClick={() => navigate("/calendar")}
            >
              Prendre rendez-vous
            </button> */}
          </div>
        </div>

        <aside className="notfound-side">
          <div className="side-card">
            <span className="side-card-label">Liens utiles</span>
            <button className="notfound-link-btn" onClick={() => navigate("/")}>
              Accueil
            </button>
            {/* <button
              className="notfound-link-btn"
              onClick={() => navigate("/calendar")}
            >
              Calendrier
            </button> */}
          </div>

          <div className="side-card">
            <span className="side-card-label">Besoin d'aide ?</span>
            <a href="tel:+15144430575">(514) 443-0575</a>
            <a href="mailto:cicilsignature@gmail.com">
              cicilsignature@gmail.com
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}
