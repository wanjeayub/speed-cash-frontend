import api from "./api";

class PublicService {
  async getLoanSettings() {
    const response = await api.get("/public/loan-settings");
    return response.data;
  }
}

export default new PublicService();
