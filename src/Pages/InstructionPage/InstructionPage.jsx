import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../composant/NAV/Navbar";
import "./CSS/InstructionPage.css";

export default function InstructionPage() {
    const navigate = useNavigate();
    const { state: lash } = useLocation();

    return (
        <>
            <Navbar />

            <div className="instructionsWrapper">
                <div className="instructionsCard">
                    <h1>{lash?.type}</h1>

                    <p className="serviceInfo">
                        💰 {lash?.price}$ • ⏱️ {lash?.duration}
                    </p>

                    <h2>Avant votre rendez-vous</h2>

                    <ul>
                        <li>Arrivez sans maquillage sur les yeux.</li>
                        <li>Évitez les produits huileux 24h avant.</li>
                        <li>Prévoyez suffisamment de temps pour la pose.</li>
                        <li>Un acompte de {lash?.deposit}$ est requis.</li>
                        <li>Veuillez arriver à l'heure.</li>
                    </ul>

                    <button
                        className="continueBtn"
                        onClick={() =>
                            navigate("/monthly-calendar", {
                                state: lash,
                            })
                        }
                    >
                        Continuer vers le calendrier
                    </button>
                </div>
            </div>
        </>
    );
}