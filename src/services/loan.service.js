import api from "./api";

class LoanService {
  // Get all loans for the current user
  async getUserLoans() {
    const response = await api.get("/users/loans");
    return response.data;
  }

  // Get single loan by ID
  async getLoanById(loanId) {
    const response = await api.get(`/loans/${loanId}`);
    return response.data;
  }

  // Apply for a new loan
  async applyForLoan(loanData) {
    const response = await api.post("/loans/apply", loanData);
    return response.data;
  }

  // Calculate loan eligibility
  async calculateEligibility(amount) {
    const response = await api.post("/loans/calculate-eligibility", { amount });
    return response.data;
  }

  // Get repayment schedule for a loan
  async getRepaymentSchedule(loanId) {
    const response = await api.get(`/loans/${loanId}/schedule`);
    return response.data;
  }

  // Make a repayment
  async makeRepayment(loanId, paymentData) {
    const response = await api.post(`/loans/${loanId}/repay`, paymentData);
    return response.data;
  }

  // Download loan statement
  async downloadLoanStatement(loanId) {
    const response = await api.get(`/loans/${loanId}/statement`, {
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `loan-statement-${loanId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return response.data;
  }

  // Get loan types and interest rates
  async getLoanProducts() {
    const response = await api.get("/loans/products");
    return response.data;
  }
}

export default new LoanService();
