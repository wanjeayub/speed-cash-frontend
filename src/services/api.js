import axios from "axios";

const api = axios.create({
  baseURL: "https://scs-backend-khaki.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token and log requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Enhanced logging
    console.log("=== API REQUEST ===");
    console.log("URL:", config.url);
    console.log("Method:", config.method);
    console.log("Headers:", config.headers);
    console.log("Data being sent:", config.data);
    console.log("Data as string:", JSON.stringify(config.data));
    console.log("===================");

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.status === 401) {
      // Only redirect if not on login page
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
