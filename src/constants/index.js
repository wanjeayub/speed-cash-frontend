// Loan status constants
export const LOAN_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  PARTIAL: "partial",
  PAID: "paid",
  DEFAULTED: "defaulted",
};

// Loan status display names
export const LOAN_STATUS_LABELS = {
  [LOAN_STATUS.PENDING]: "Pending Review",
  [LOAN_STATUS.APPROVED]: "Approved",
  [LOAN_STATUS.REJECTED]: "Rejected",
  [LOAN_STATUS.PARTIAL]: "Partially Paid",
  [LOAN_STATUS.PAID]: "Fully Paid",
  [LOAN_STATUS.DEFAULTED]: "Defaulted",
};

// User roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// Photo types
export const PHOTO_TYPES = {
  PROFILE: "profile",
  ID_FRONT: "idFront",
  ID_BACK: "idBack",
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GOOGLE: "/auth/google",
    ME: "/auth/me",
  },
  USERS: {
    PROFILE: "/users/profile",
    UPLOAD_PHOTO: "/users/upload-photo",
    LOANS: "/users/loans",
  },
  LOANS: {
    APPLY: "/loans/apply",
    DETAILS: (id) => `/loans/${id}`,
    REPAY: (id) => `/loans/${id}/repay`,
  },
  ADMIN: {
    USERS: "/admin/users",
    USER_DETAILS: (id) => `/admin/users/${id}`,
    LOANS: "/admin/loans",
    STATS: "/admin/stats",
    APPROVE_LOAN: (id) => `/admin/loans/${id}/approve`,
    REJECT_LOAN: (id) => `/admin/loans/${id}/reject`,
    PROCESS_PAYMENT: (id) => `/admin/loans/${id}/pay`,
  },
};

// Loan limits
export const LOAN_LIMITS = {
  MIN: 100,
  MAX: 1000000,
  DEFAULT_INTEREST: 10,
  DEFAULT_TERM_DAYS: 30,
};

// Credit score thresholds
export const CREDIT_SCORE = {
  POOR_MAX: 39,
  FAIR_MAX: 69,
  GOOD_MIN: 70,
};

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
};
