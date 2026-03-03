// Kenyan phone number validation (0712345678, 0112345678, etc.)
export const validateKenyanPhone = (phone) => {
  const phoneRegex = /^(0|254|\+254)[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

// Kenyan ID validation (7-8 digits)
export const validateKenyanId = (id) => {
  const idRegex = /^\d{7,8}$/;
  return idRegex.test(id);
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    length: password.length >= 6,
  };
};

// Loan amount validation
export const validateLoanAmount = (amount, min = 100, max = 1000000) => {
  return amount >= min && amount <= max;
};

// Date validation
export const validateDate = (date) => {
  return date instanceof Date && !isNaN(date);
};
