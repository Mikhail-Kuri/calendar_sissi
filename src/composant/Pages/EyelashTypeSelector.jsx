import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NAV/Navbar";
import "./CSS/EyelashTypeSelector.css";

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
  new Type(1, "lashes", "Classique",   "Un look naturel avec un cil synthétique par cil naturel.",         "/photos/classic.jpeg", 50, "1h",   20, "Naturel"),
  new Type(2, "lashes", "Volume",      "Plusieurs extensions sur un cil naturel pour un style plus fourni.","/photos/volume.jpeg",  80, "1h30", 20, "Glamour"),
  new Type(3, "lashes", "Hybride",     "Un mélange de classique et volume pour un look équilibré.",         "/photos/hybrid.jpeg",  65, "3h",   20, "Équilibré"),
  new Type(4, "lashes", "Mega Volume", "Un look très intense avec beaucoup de densité.",                    "/photos/classic.jpeg", 95, "4h30", 25, "Intense"),
  new Type(5, "lashes", "Wispy",       "Effet texturé et aérien inspiré du style Kim K.",                  "/photos/volume.jpeg",  85, "4h",   20, "Tendance"),
  new Type(6, "lashes", "Fox Eyes",    "Effet allongé pour un regard étiré et félin.",                     "/photos/hybrid.jpeg",  75, "3h45", 20, "Félin"),
];

export default function EyelashTypeSelector() {
  const navigate = useNavigate();

  const handleSelect = (lash) => {
    navigate("/instructions", { state: lash });
  };

  return (
    <div>
      <Navbar />
      <div className="ets-page">

        <header className="ets-hero">
          <div className="ets-hero-tag">Extensions de cils · Sissi Signature</div>
          <h1>Choisissez votre style</h1>
          <p>Chaque prestation est adaptée à la morphologie de vos yeux</p>
        </header>

        <div className="ets-body">
          <p className="ets-step-label">Étape 1 sur 3</p>
          <p className="ets-section-title">Quel type d'extensions vous correspond ?</p>

          <div className="ets-grid">
            {EYELASH_TYPES.map((lash) => (
              <LashCard key={lash.id} lash={lash} onSelect={handleSelect} />
            ))}
          </div>
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