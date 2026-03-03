// Format currency (KES)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date, format = "PPP") => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return phone;
};

// Truncate text
export const truncateText = (text, length = 50) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

// Format loan status
export const formatLoanStatus = (status) => {
  const statusMap = {
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
    partial: "Partially Paid",
    paid: "Fully Paid",
    defaulted: "Defaulted",
  };
  return statusMap[status] || status;
};

// Get status color class
export const getStatusColor = (status) => {
  const colorMap = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    partial: "bg-purple-100 text-purple-800",
    paid: "bg-blue-100 text-blue-800",
    defaulted: "bg-gray-100 text-gray-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};
