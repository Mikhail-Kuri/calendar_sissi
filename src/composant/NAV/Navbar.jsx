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
          <Link to="/">Accueil</Link>
          <Link to="/selector/lashes">Réserver</Link>
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
        <Link to="/selector/lashes" onClick={() => setMenuOpen(false)}>
          Réserver
        </Link>
      </div>
    </>
  );
}
