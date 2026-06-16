import "./CSS/footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Sissi Signature</span>
          <p className="footer-tagline">
            Lash tech &amp; nail tech certifiée · Montréal
          </p>
        </div>

        <div className="footer-contact">
          <a href="tel:+15144430575">(514) 443-0575</a>
          <a href="mailto:cicilsignature@gmail.com">cicilsignature@gmail.com</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Sissi Signature</span>
      </div>
    </footer>
  );
}
