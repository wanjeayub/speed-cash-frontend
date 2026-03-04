import api from "./api";

class AdminSettingsService {
  async getSettings() {
    const response = await api.get("/admin/settings");
    return response.data;
  }

  async updateNotificationSettings(settings) {
    const response = await api.put("/admin/settings/notifications", settings);
    return response.data;
  }

  async updateLoanSettings(settings) {
    const response = await api.put("/admin/settings/loan", settings);
    return response.data;
  }

  async updateCreditThresholds(thresholds) {
    const response = await api.put(
      "/admin/settings/credit-thresholds",
      thresholds,
    );
    return response.data;
  }

  async updateBusinessInfo(info) {
    const response = await api.put("/admin/settings/business", info);
    return response.data;
  }

  async updateSecuritySettings(settings) {
    const response = await api.put("/admin/settings/security", settings);
    return response.data;
  }

  async toggleMaintenanceMode(mode) {
    const response = await api.put("/admin/settings/maintenance", mode);
    return response.data;
  }
}

export default new AdminSettingsService();
