// utils/validators.js
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) => /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);

export const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export function isFormValid(formData = {}) {
  return (
    (formData.phone || "").trim().length > 0 &&
    (formData.email || "").trim().length > 0 &&
    (formData.emailConfirm || "").trim().length > 0 &&
    isValidEmail(formData.emailConfirm) &&
    isValidEmail(formData.email || "") &&
    isValidPhone(formData.phone || "")
  );
}
