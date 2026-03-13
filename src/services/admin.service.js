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

  // Admin Management
  async getAllAdmins() {
    const response = await api.get("/admin/manage/admins");
    return response.data;
  }

  async promoteToAdmin(userId) {
    const response = await api.put(`/admin/manage/promote/${userId}`);
    return response.data;
  }

  async demoteFromAdmin(adminId) {
    const response = await api.put(`/admin/manage/demote/${adminId}`);
    return response.data;
  }

  async createAdmin(adminData) {
    const response = await api.post("/admin/manage/create", adminData);
    return response.data;
  }
  // Due Loans Management
  async getDueLoansToday() {
    const response = await api.get("/admin/due-loans/today");
    return response.data;
  }

  async getUpcomingDueLoans() {
    const response = await api.get("/admin/due-loans/upcoming");
    return response.data;
  }

  async getOverdueLoans() {
    const response = await api.get("/admin/due-loans/overdue");
    return response.data;
  }

  async sendDueLoansNotification() {
    const response = await api.post("/admin/due-loans/send-notification");
    return response.data;
  }

  async checkAndUpdateDefaulted() {
    const response = await api.post("/admin/due-loans/check-defaults");
    return response.data;
  }
}

export default new AdminService();
