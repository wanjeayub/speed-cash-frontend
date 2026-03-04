import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { HelmetProvider } from "react-helmet-async";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Import the new pages
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import DataProtection from "./pages/DataProtection";
import Complaints from "./pages/Complaints";

// Components
import PrivateRoute from "./components/PrivateRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const { loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/data-protection" element={<DataProtection />} />
            <Route path="/complaints" element={<Complaints />} />

            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminRequired>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <PrivateRoute adminRequired>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
