import api from "./api";

class AdminService {
  async getAllUsers() {
    const response = await api.get("/admin/users");
    return response.data;
  }

  async getUserDetails(userId) {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  }

  async getAllLoans(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await api.get(`/admin/loans?${queryParams}`);
    return response.data;
  }

  async getLoanStats(year) {
    const response = await api.get(`/admin/stats?year=${year}`);
    return response.data;
  }

  async approveLoan(loanId, notes) {
    const response = await api.put(`/admin/loans/${loanId}/approve`, { notes });
    return response.data;
  }

  async rejectLoan(loanId, reason) {
    const response = await api.put(`/admin/loans/${loanId}/reject`, { reason });
    return response.data;
  }

  async processPayment(loanId, paymentData) {
    const response = await api.post(`/admin/loans/${loanId}/pay`, paymentData);
    return response.data;
  }
}

export default new AdminService();
