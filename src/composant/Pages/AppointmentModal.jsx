import { formatPhoneNumber, isFormValid } from "../../utils/validators";
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
  handleSubmit,
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
        {/* LOADING STATE */}
        {modalState === "loading" && (
          <div className="modalCenter">
            <div className="spinner" />
            <p>Confirmation de votre rendez-vous...</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {modalState === "success" && (
          <div className="modalCenter success">
            <h2>🎉 Réservation confirmée</h2>
            <p>Merci ! Votre rendez-vous a été enregistré.</p>
            <p>À bientôt 👋</p>
          </div>
        )}

        {/* FORM STATE */}
        {modalState === "idle" && (
          <>
            <h2 className="modalTitle">📌 Informations du rendez-vous</h2>

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

            <label>Confirmer le email *</label>
            <input
              type="email"
              className="input"
              value={formData.emailConfirm}
              onChange={(e) => handleChange("emailConfirm", e.target.value)}
            />

            {formData.emailConfirm &&
              formData.email !== formData.emailConfirm && (
                <p
                  style={{
                    color: "red",
                    fontSize: "0.85rem",
                    marginTop: "-0.5rem",
                  }}
                >
                  Les emails ne correspondent pas
                </p>
              )}

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
                className="button"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>

              <button
                type="button"
                className="button"
                disabled={!isFormValid || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Confirmation..." : "Réserver"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
