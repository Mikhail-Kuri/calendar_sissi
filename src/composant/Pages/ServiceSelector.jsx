import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../NAV/Navbar";
import "./CSS/ServiceSelector.css";

class Type {
  constructor(id, service, type, desc, image, price, duration, deposit, tag) {
    this.id = id;
    this.service = service;
    this.type = type;
    this.desc = desc;
    this.image = image;
    this.price = price;
    this.duration = duration;
    this.deposit = deposit;
    this.tag = tag;
  }
}

const EYELASH_TYPES = [
  new Type(
    1,
    "lashes",
    "Classique",
    "Un look naturel avec un cil synthétique par cil naturel.",
    "/photos/classic.jpeg",
    50,
    "1h",
    20,
    "Naturel",
  ),
  new Type(
    2,
    "lashes",
    "Volume",
    "Plusieurs extensions sur un cil naturel pour un style plus fourni.",
    "/photos/volume.jpeg",
    80,
    "1h30",
    20,
    "Glamour",
  ),
  new Type(
    3,
    "lashes",
    "Hybride",
    "Un mélange de classique et volume pour un look équilibré.",
    "/photos/hybrid.jpeg",
    65,
    "3h",
    20,
    "Équilibré",
  ),
  new Type(
    4,
    "lashes",
    "Mega Volume",
    "Un look très intense avec beaucoup de densité.",
    "/photos/classic.jpeg",
    95,
    "4h30",
    25,
    "Intense",
  ),
  new Type(
    5,
    "lashes",
    "Wispy",
    "Effet texturé et aérien inspiré du style Kim K.",
    "/photos/volume.jpeg",
    85,
    "4h",
    20,
    "Tendance",
  ),
  new Type(
    6,
    "lashes",
    "Fox Eyes",
    "Effet allongé pour un regard étiré et félin.",
    "/photos/hybrid.jpeg",
    75,
    "3h45",
    20,
    "Félin",
  ),
];
const NAIL_TYPES = [
  new Type(
    101,
    "nails",
    "Pose Gel",
    "Extensions en gel offrant un fini élégant et naturel.",
    "/photos/classic.jpeg",
    55,
    "1h30",
    20,
    "Populaire",
  ),

  new Type(
    102,
    "nails",
    "Pose Acrylique",
    "Extensions résistantes idéales pour une tenue prolongée.",
    "/photos/volume.jpeg",
    60,
    "2h",
    20,
    "Résistant",
  ),

  new Type(
    103,
    "nails",
    "Manucure Classique",
    "Soin complet des ongles naturels avec finition soignée.",
    "/photos/hybrid.jpeg",
    35,
    "45 min",
    10,
    "Naturel",
  ),

  new Type(
    104,
    "nails",
    "Manucure Gel",
    "Application de vernis gel pour une brillance durable.",
    "/photos/classic.jpeg",
    45,
    "1h",
    15,
    "Brillant",
  ),

  new Type(
    105,
    "nails",
    "Nail Art",
    "Décorations personnalisées et designs créatifs.",
    "/photos/volume.jpeg",
    70,
    "2h30",
    20,
    "Créatif",
  ),

  new Type(
    106,
    "nails",
    "Remplissage",
    "Entretien et retouche des extensions existantes.",
    "/photos/hybrid.jpeg",
    40,
    "1h15",
    15,
    "Entretien",
  ),
];

const SERVICES = {
  lashes: EYELASH_TYPES,
  nails: NAIL_TYPES,
};

export default function EyelashTypeSelector() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedService = searchParams.get("type");
  const navigate = useNavigate();

  const handleServiceSelect = (service) => {
    setSearchParams({ type: service });
  };

  const handleSelect = (lash) => {
    navigate("/instructions", { state: lash });
  };

  return (
    <div>
      <Navbar />
      <div className="ets-page">
        <header className="ets-hero">
          <div className="ets-hero-tag">
            Extensions de cils · Sissi Signature
          </div>
          <h1>Choisissez votre style</h1>
          <p>Chaque prestation est adaptée à la morphologie de vos yeux</p>
        </header>

        <div className="ets-body">
          <div className="ets-service-selector">
            <button
              className={`service-btn ${
                selectedService === "lashes" ? "active" : ""
              }`}
              onClick={() => handleServiceSelect("lashes")}
            >
              ✨ Cils
            </button>

            <button
              className={`service-btn ${
                selectedService === "nails" ? "active" : ""
              }`}
              onClick={() => handleServiceSelect("nails")}
            >
              💅 Ongles
            </button>
          </div>
          {/* <p className="ets-step-label">Étape 1 sur 3</p> */}
          <p className="ets-section-title">
            Quel type d'extensions vous correspond ?
          </p>

          {selectedService && (
            <div className="ets-grid">
              {SERVICES[selectedService].map((service) => (
                <LashCard
                  key={service.id}
                  lash={service}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LashCard({ lash, onSelect }) {
  return (
    <div className="ets-card" onClick={() => onSelect(lash)}>
      <div className="ets-card-img">
        <img src={lash.image} alt={`${lash.type} extensions`} />
        <div className="ets-price-badge">{lash.price} $</div>
      </div>
      <div className="ets-card-body">
        <div>
          <h3>{lash.type}</h3>
          <p className="ets-card-desc">{lash.desc}</p>
        </div>

        <p className="ets-deposit">
          Acompte requis : <strong>{lash.deposit} $</strong>
        </p>

        {/* Footer : pills + bouton — layout change via CSS sur mobile */}
        <div className="ets-card-footer">
          <div className="ets-meta">
            <span className="ets-pill">⏱ {lash.duration}</span>
            <span className="ets-pill">{lash.tag}</span>
          </div>
          <button
            className="ets-select-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(lash);
            }}
          >
            Sélectionner
          </button>
        </div>
      </div>
    </div>
  );
}
