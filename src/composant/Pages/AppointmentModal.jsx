import {formatPhoneNumber} from "../../utils/validators";


export function AppointmentModal({
    showModal,
    formData,
    setFormData,
    errorMessage,
    successMessage,
    isSubmitting,
    isFormValid,
    handleSubmit,
    setShowModal
}) {
    if (!showModal) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent">

                <h2 className="modalTitle">
                    📌 Informations du rendez-vous
                </h2>

                <label htmlFor="phone">
                    Numéro de téléphone *
                </label>

                <input
                    id="phone"
                    type="text"
                    className="input"
                    placeholder="(514) 123-4567"
                    value={formData.phone}
                    onChange={(e) =>
                        handleChange(
                            "phone",
                            formatPhoneNumber(e.target.value)
                        )
                    }
                />

                <label htmlFor="email">
                    Email *
                </label>

                <input
                    id="email"
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) =>
                        handleChange("email", e.target.value)
                    }
                />

                <label htmlFor="message">
                    Message (optionnel)
                </label>

                <textarea
                    id="message"
                    className="textarea"
                    value={formData.message}
                    onChange={(e) =>
                        handleChange("message", e.target.value)
                    }
                />

                {errorMessage && (
                    <p className="errorMessage">
                        {errorMessage}
                    </p>
                )}

                {successMessage && (
                    <p className="successMessage">
                        {successMessage}
                    </p>
                )}

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
                        {isSubmitting
                            ? "Confirmation..."
                            : "Réserver"}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default AppointmentModal;