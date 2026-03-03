import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Helmet } from "react-helmet-async";
import { FiMail, FiLock, FiLogIn, FiPhone } from "react-icons/fi";
import { login, googleLogin, clearError } from "../store/slices/authSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [phoneNumbers, setPhoneNumbers] = useState(["", ""]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

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

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      console.log("Dispatching login action with:", formData.email);
      const resultAction = await dispatch(login(formData));

      if (login.fulfilled.match(resultAction)) {
        console.log("Login successful:", resultAction.payload);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else if (login.rejected.match(resultAction)) {
        console.error("Login rejected:", resultAction.payload);
        // Error is already shown via the error state and useEffect
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("An unexpected error occurred");
    }
  };

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

        const resultAction = await dispatch(
          googleLogin({
            email: userInfo.email,
            googleId: userInfo.sub,
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
            profilePhoto: userInfo.picture,
          }),
        );

        if (googleLogin.fulfilled.match(resultAction)) {
          toast.success("Google login successful!");
          navigate("/dashboard");
        } else if (googleLogin.rejected.match(resultAction)) {
          // Check if error indicates missing phone numbers
          if (resultAction.payload?.toLowerCase().includes("phone")) {
            setGoogleUserData({
              email: userInfo.email,
              googleId: userInfo.sub,
              firstName: userInfo.given_name,
              lastName: userInfo.family_name,
              profilePhoto: userInfo.picture,
            });
            setShowPhoneModal(true);
          }
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

    const resultAction = await dispatch(
      googleLogin({
        ...googleUserData,
        phoneNumbers: phoneNumbers.filter((p) => p.trim() !== ""),
      }),
    );

    if (googleLogin.fulfilled.match(resultAction)) {
      setShowPhoneModal(false);
      toast.success("Profile completed successfully!");
      navigate("/dashboard");
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Speedy Cash Solutions</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600">SpeedyCash</h1>
            <p className="text-gray-600 mt-2">Solutions</p>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Welcome Back
          </h2>

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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email"
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
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <FiLogIn />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

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

          <button
            onClick={() => googleLoginHandler()}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
              {loading ? "Processing..." : "Sign in with Google"}
            </span>
          </button>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0733 456 789"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPhoneModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePhoneSubmit}
                  disabled={loading}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner size="small" /> : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
