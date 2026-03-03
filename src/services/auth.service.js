import api from "./api";

class AuthService {
  async login(credentials) {
    try {
      console.log("Attempting login with:", credentials.email);
      const response = await api.post("/auth/login", credentials);
      console.log("Login response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login service error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error(
        "Register service error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async googleLogin(userData) {
    try {
      console.log("Sending Google login data:", userData);
      const response = await api.post("/auth/google", userData);
      return response.data;
    } catch (error) {
      console.error(
        "Google login service error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error(
        "Get current user error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export default new AuthService();
