import React, { useState, useEffect, useRef } from "react";
import "./CSS/HomePage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../composant/NAV/Navbar";

const HERO_SLIDES = [
  {
    id: "lashes",
    tag: "Extensions de cils · Sissi Signature",
    title: (
      <>
        Un regard qui
        <br />
        vous démarque
      </>
    ),
    subtitle:
      "Prestations personnalisées · Produits premium · Résultats durables",
    btnLabel: "Réserver — Extensions cils",
    path: "/calendar",
  },
  {
    id: "nails",
    tag: "Nail Tech certifiée · Sissi Signature",
    title: (
      <>
        Des ongles qui
        <br />
        vous ressemblent
      </>
    ),
    subtitle: "Gel · Capsules · Nail art · Soins sur mesure",
    btnLabel: "Réserver — Ongles",
    path: "/calendar",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("apropos");
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  const goTo = (index) => {
    const n = HERO_SLIDES.length;
    setActiveSlide((index + n) % n);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % n);
    }, 8000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      goTo(activeSlide + (delta > 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  const tabs = [
    { id: "apropos", label: "À propos" },
    { id: "horaire", label: "Horaire" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="homepage">
      <Navbar />

      {/* ── Hero carousel ── */}
      <header
        className="hero-section"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-slide ${activeSlide === i ? "active" : ""}`}
          >
            <div className="hero-tag">{slide.tag}</div>
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <button
              className="btn-reserver"
              onClick={() => navigate(slide.path)}
            >
              {slide.btnLabel}
            </button>
          </div>
        ))}

        {/* Flèches — masquées sur mobile via CSS */}
        <button
          className="hero-arrow left"
          onClick={() => goTo(activeSlide - 1)}
          aria-label="Slide précédent"
        >
          ‹
        </button>
        <button
          className="hero-arrow right"
          onClick={() => goTo(activeSlide + 1)}
          aria-label="Slide suivant"
        >
          ›
        </button>

        {/* Dots */}
        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${activeSlide === i ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
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

            <div
              className={`tab-panel ${activeTab === "contact" ? "active" : ""}`}
            >
              <h2>Nous joindre</h2>
              <p>
                Pour toute question ou pour prendre rendez-vous directement :
              </p>
              <p>
                <strong>Téléphone :</strong> +1 (514) 443-0575
              </p>
              <p>
                <strong>Courriel :</strong> cicilsignature@gmail.com
              </p>
            </div>
          </div>
        </div>

        <div className="infos-side">
          <div className="side-card">
            <p className="side-card-label">Disponibilité</p>
            <div className="avail-row">
              <span className="pulse-dot"></span>
              Ouvert aux réservations
            </div>
          </div>

          {/* <div className="side-card">
            <p className="side-card-label">Horaires</p>
            <div className="hours-grid">
              <span className="day">Lun – Ven</span>
              <span className="time">9h – 18h</span>
              <span className="day">Samedi</span>
              <span className="time">10h – 16h</span>
              <span className="day">Dimanche</span>
              <span className="time">Fermé</span>
            </div>
          </div> */}

          <div className="side-card">
            <p className="side-card-label">Contact rapide</p>
            <a href="tel:+15144430575">(514) 443-0575</a>
            <a href="mailto:cicilsignature@gmail.com">
              cicilsignature@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
