import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CSS/Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Sissi
        </Link>

        <div className="nav-links">
          {/* Accueil et Réserver partagent maintenant le même look */}
          <Link to="/" className="nav-link-btn">
            Accueil
          </Link>

          <div className="nav-dropdown">
            <button className="nav-drop-btn">Réserver ▾</button>
            <div className="dropdown-menu">
              <Link to="/selector?type=lashes">✨ Cils</Link>
              <Link to="/selector?type=nails">💅 Ongles</Link>
            </div>
          </div>
        </div>

        <button
          className={`burger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Accueil
        </Link>
        <div className="mobile-menu-item">
          <span>Réserver</span>
          <Link to="/selector?type=lashes" onClick={() => setMenuOpen(false)}>
            ✨ Cils
          </Link>
          <Link to="/selector?type=nails" onClick={() => setMenuOpen(false)}>
            💅 Ongles
          </Link>
        </div>
      </div>
    </>
  );
}
