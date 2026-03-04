import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Helmet } from "react-helmet-async";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiPhone,
  FiShield,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";
import { login, googleLogin, clearError } from "../store/slices/authSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth,
  );

  // Check if we're on admin login route
  const isAdminRoute = location.pathname === "/admin/login";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isAdminLogin, setIsAdminLogin] = useState(isAdminRoute);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [phoneNumbers, setPhoneNumbers] = useState(["", ""]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (!result.error) {
      toast.success("Login successful!");
    }
  };

  // Google Login Handler
  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info from Google");
        }

        const userInfo = await response.json();

        const result = await dispatch(
          googleLogin({
            email: userInfo.email,
            googleId: userInfo.sub,
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
            profilePhoto: userInfo.picture,
          }),
        );

        if (!result.error) {
          toast.success("Google login successful!");
        } else if (result.payload?.includes("phone")) {
          setGoogleUserData({
            email: userInfo.email,
            googleId: userInfo.sub,
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
            profilePhoto: userInfo.picture,
          });
          setShowPhoneModal(true);
        }
      } catch (error) {
        console.error("Google Login Failed:", error);
        toast.error("Google login failed. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      toast.error("Google login failed. Please try again.");
    },
    flow: "implicit",
  });

  const handlePhoneSubmit = async () => {
    if (!phoneNumbers[0] || !phoneNumbers[1]) {
      toast.error("Please provide at least two phone numbers");
      return;
    }

    const result = await dispatch(
      googleLogin({
        ...googleUserData,
        phoneNumbers: phoneNumbers.filter((p) => p.trim() !== ""),
      }),
    );

    if (!result.error) {
      setShowPhoneModal(false);
      toast.success("Registration completed!");
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {isAdminLogin ? "Admin Login" : "Login"} - Speedy Cash Solutions
        </title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Breadcrumb */}
        <div className="bg-white border-b pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-primary-600">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-primary-600 font-medium">
                {isAdminLogin ? "Admin Login" : "Login"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Features/Benefits */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-6">
                  Welcome Back to SpeedyCash
                </h2>
                <p className="text-primary-100 mb-8">
                  Access your account to manage loans, track payments, and apply
                  for new financing.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FiCheckCircle className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Quick Loan Access</h3>
                      <p className="text-sm text-primary-100">
                        Apply for loans in minutes with our streamlined process
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FiCheckCircle className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Track Your Loans</h3>
                      <p className="text-sm text-primary-100">
                        Monitor your loan status and repayment schedule in
                        real-time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FiCheckCircle className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Secure & Private</h3>
                      <p className="text-sm text-primary-100">
                        Your data is encrypted and protected with bank-level
                        security
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FiCheckCircle className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">24/7 Support</h3>
                      <p className="text-sm text-primary-100">
                        Our customer support team is always ready to help
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="mt-8 bg-white/10 p-4 rounded-xl">
                  <p className="text-sm italic mb-2">
                    "SpeedyCash has been a lifesaver. The login process is
                    smooth and I can access my loans anytime."
                  </p>
                  <p className="text-sm font-semibold">— Sarah K., Nairobi</p>
                </div>
              </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto w-full lg:mx-0">
              {/* Logo for mobile */}
              <div className="text-center lg:hidden mb-6">
                <h1 className="text-2xl font-bold text-primary-600">
                  SpeedyCash
                </h1>
                <p className="text-gray-600 text-sm">Solutions</p>
              </div>

              {/* Login Type Toggle */}
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <Link
                  to="/login"
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors text-center ${
                    !isAdminLogin
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setIsAdminLogin(false)}
                >
                  User Login
                </Link>
                <Link
                  to="/admin/login"
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
                    isAdminLogin
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setIsAdminLogin(true)}
                >
                  <FiShield size={16} />
                  <span>Admin Login</span>
                </Link>
              </div>

              <h2 className="text-2xl font-semibold mb-6">
                {isAdminLogin ? "Admin Sign In" : "Welcome Back"}
              </h2>

              {/* Admin Notice */}
              {isAdminLogin && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start space-x-2">
                  <FiShield className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800">
                    This area is restricted to authorized administrators only.
                    Please use your admin credentials to sign in.
                  </p>
                </div>
              )}

              {/* Email/Password Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder={
                        isAdminLogin ? "Enter admin email" : "Enter your email"
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pl-10 pr-10"
                      placeholder={
                        isAdminLogin
                          ? "Enter admin password"
                          : "Enter your password"
                      }
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-primary-600"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
                >
                  {loading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <FiLogIn />
                      <span>
                        {isAdminLogin ? "Sign in as Admin" : "Sign In"}
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider - Only show for user login */}
              {!isAdminLogin && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Login Button */}
                  <button
                    onClick={() => googleLoginHandler()}
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-3 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">
                      Sign in with Google
                    </span>
                  </button>
                </>
              )}

              {/* Admin Help Text */}
              {isAdminLogin && (
                <p className="text-center mt-4 text-xs text-gray-500">
                  Having trouble with admin access? Contact the system
                  administrator.
                </p>
              )}

              {/* Register Link - Only show for user login */}
              {!isAdminLogin && (
                <p className="text-center mt-6 text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              )}

              {/* Back to User Login Link for Admin */}
              {isAdminLogin && (
                <p className="text-center mt-6">
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 inline-flex items-center"
                  >
                    <FiArrowLeft className="mr-1" size={16} />
                    Back to User Login
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Phone Number Collection Modal for Google Users */}
        {showPhoneModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-xl font-semibold mb-4">
                Complete Your Profile
              </h3>
              <p className="text-gray-600 mb-6">
                Please provide at least two phone numbers to complete your
                registration.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneNumbers[0]}
                      onChange={(e) =>
                        setPhoneNumbers([e.target.value, phoneNumbers[1]])
                      }
                      className="input-field pl-10"
                      placeholder="0712 345 678"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneNumbers[1]}
                      onChange={(e) =>
                        setPhoneNumbers([phoneNumbers[0], e.target.value])
                      }
                      className="input-field pl-10"
                      placeholder="0733 456 789"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowPhoneModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePhoneSubmit}
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? <LoadingSpinner size="small" /> : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Login;
