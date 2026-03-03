import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { store } from "./store";
import "./index.css"; // Make sure this is imported

// Get Google Client ID from environment variables
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.warn(
    "Google Client ID is missing. Google login will not work. Please check your .env file",
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={googleClientId || "dummy-client-id"}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
            loading: {
              duration: Infinity,
              style: {
                background: "#3B82F6",
              },
            },
          }}
        />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
);
