import api from "./api";

class AuthService {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  }

  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  }

  async googleLogin(userData) {
    const response = await api.post("/auth/google", userData);
    return response.data;
  }

  async getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data;
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export default new AuthService();
