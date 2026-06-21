import { formatPhoneNumber } from "../../utils/validators";
import "./CSS/AppointmentModal.css";

export function AppointmentModal({
  modalState,
  showModal,
  formData,
  setFormData,
  errorMessage,
  successMessage,
  isSubmitting,
  isFormValid,
  handleRequest,
  handleConfirm,
  step,
  verificationCode,
  setVerificationCode,
  setShowModal,
}) {
  if (!showModal) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        {modalState === "loading" && (
          <div className="modalCenter">
            <div className="spinner" />
            <p>Confirmation de votre rendez-vous...</p>
          </div>
        )}

        {modalState === "success" && (
          <div className="modalCenter success">
            <div className="successIcon">✓</div>
            <h2>Réservation confirmée</h2>
            <p>Merci ! Votre rendez-vous a été enregistré.</p>
            <p>
              Vous recevrez un courriel de confirmation pour la réservation.
            </p>
            <p className="successSub">À bientôt 👋</p>
          </div>
        )}

        {modalState === "idle" && step === "form" && (
          <>
            <h2 className="modalTitle">Informations du rendez-vous</h2>

            <label>Numéro de téléphone *</label>
            <input
              type="text"
              className="input"
              value={formData.phone}
              onChange={(e) =>
                handleChange("phone", formatPhoneNumber(e.target.value))
              }
            />

            <label>Email *</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <label>Message (optionnel)</label>
            <textarea
              className="textarea"
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
            />

            {errorMessage && <p className="errorMessage">{errorMessage}</p>}

            <div className="modalActions">
              <button
                type="button"
                className="button buttonSecondary"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>

              <button
                type="button"
                className="button buttonPrimary"
                disabled={!isFormValid || isSubmitting}
                onClick={handleRequest}
              >
                {isSubmitting ? "Envoi..." : "Recevoir le code"}
              </button>
            </div>
          </>
        )}

        {modalState === "idle" && step === "verify" && (
          <>
            <h2 className="modalTitle">Vérification du code</h2>

            <p className="modalSubtext">
              Un code de vérification a été envoyé à votre adresse courriel.
            </p>

            <input
              type="text"
              className="input codeInput"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />

            {errorMessage && <p className="errorMessage">{errorMessage}</p>}

            <div className="modalActions">
              <button
                type="button"
                className="button buttonSecondary"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>

              <button
                type="button"
                className="button buttonPrimary"
                disabled={isSubmitting}
                onClick={handleConfirm}
              >
                {isSubmitting ? "Validation..." : "Confirmer"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
