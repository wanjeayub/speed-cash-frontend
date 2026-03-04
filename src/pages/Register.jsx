import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Helmet } from "react-helmet-async";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiCreditCard,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { register, googleLogin, clearError } from "../store/slices/authSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    idNumber: "",
    firstName: "",
    lastName: "",
    phoneNumbers: ["", ""],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);

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
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.phoneNumbers];
    newPhones[index] = value;
    setFormData({
      ...formData,
      phoneNumbers: newPhones,
    });
    if (errors.phoneNumbers) {
      setErrors({
        ...errors,
        phoneNumbers: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.idNumber.match(/^\d{7,8}$/)) {
      newErrors.idNumber = "Please enter a valid Kenyan ID number (7-8 digits)";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    const phoneRegex = /^0\d{9}$/;
    if (
      !formData.phoneNumbers[0] ||
      !phoneRegex.test(formData.phoneNumbers[0])
    ) {
      newErrors.phone0 =
        "Please enter a valid Kenyan phone number (e.g., 0712345678)";
    }
    if (
      !formData.phoneNumbers[1] ||
      !phoneRegex.test(formData.phoneNumbers[1])
    ) {
      newErrors.phone1 = "Please enter a valid Kenyan phone number";
    }
    if (formData.phoneNumbers[0] === formData.phoneNumbers[1]) {
      newErrors.phoneNumbers = "Phone numbers must be different";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const result = await dispatch(register(formData));
      if (!result.error) {
        navigate("/dashboard");
      }
    }
  };

  // Google Register Handler
  const googleRegisterHandler = useGoogleLogin({
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

        // Pre-fill form with Google data
        setFormData({
          ...formData,
          email: userInfo.email,
          firstName: userInfo.given_name || "",
          lastName: userInfo.family_name || "",
        });

        setGoogleUserData({
          email: userInfo.email,
          googleId: userInfo.sub,
          firstName: userInfo.given_name || "",
          lastName: userInfo.family_name || "",
          profilePhoto: userInfo.picture,
        });

        // First show ID number modal
        setShowIdModal(true);
      } catch (error) {
        console.error("Google Registration Failed:", error);
        toast.error("Google registration failed. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Google Registration Error:", error);
      toast.error("Google registration failed. Please try again.");
    },
    flow: "implicit",
  });

  const handleIdSubmit = () => {
    if (!formData.idNumber.match(/^\d{7,8}$/)) {
      toast.error("Please enter a valid Kenyan ID number (7-8 digits)");
      return;
    }
    setShowIdModal(false);
    setShowPhoneModal(true);
  };

  const handleGooglePhoneSubmit = async () => {
    // Validate phone numbers
    const phoneRegex = /^0\d{9}$/;
    if (
      !formData.phoneNumbers[0] ||
      !phoneRegex.test(formData.phoneNumbers[0])
    ) {
      toast.error(
        "Please enter a valid primary phone number (e.g., 0712345678)",
      );
      return;
    }
    if (
      !formData.phoneNumbers[1] ||
      !phoneRegex.test(formData.phoneNumbers[1])
    ) {
      toast.error(
        "Please enter a valid secondary phone number (e.g., 0733456789)",
      );
      return;
    }
    if (formData.phoneNumbers[0] === formData.phoneNumbers[1]) {
      toast.error("Phone numbers must be different");
      return;
    }

    // Prepare complete user data for Google registration
    const completeGoogleUserData = {
      ...googleUserData,
      idNumber: formData.idNumber,
      phoneNumbers: formData.phoneNumbers.filter((p) => p.trim() !== ""),
    };

    console.log("Submitting Google user data:", completeGoogleUserData); // Debug log

    const result = await dispatch(googleLogin(completeGoogleUserData));

    if (!result.error) {
      setShowPhoneModal(false);
      toast.success("Registration successful! Please complete your profile.");
      navigate("/dashboard");
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - Speed- Cash Solutions</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600">Speed-Cash</h1>
            <p className="text-gray-600 mt-2">Solutions</p>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Create Account
          </h2>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.firstName ? "border-red-500" : ""}`}
                    placeholder="John"
                    required
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.lastName ? "border-red-500" : ""}`}
                    placeholder="Doe"
                    required
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
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
                  className={`input-field pl-10 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="john@example.com"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* ID Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Number (Kenyan)
              </label>
              <div className="relative">
                <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.idNumber ? "border-red-500" : ""}`}
                  placeholder="12345678"
                  required
                />
              </div>
              {errors.idNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>
              )}
            </div>

            {/* Password */}
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
                  className={`input-field pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Phone Numbers */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Phone Numbers (Minimum 2)
              </label>
              <div>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phoneNumbers[0]}
                    onChange={(e) => handlePhoneChange(0, e.target.value)}
                    className={`input-field pl-10 ${errors.phone0 ? "border-red-500" : ""}`}
                    placeholder="Primary: 0712345678"
                    required
                  />
                </div>
                {errors.phone0 && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone0}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phoneNumbers[1]}
                    onChange={(e) => handlePhoneChange(1, e.target.value)}
                    className={`input-field pl-10 ${errors.phone1 ? "border-red-500" : ""}`}
                    placeholder="Secondary: 0733456789"
                    required
                  />
                </div>
                {errors.phone1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone1}</p>
                )}
              </div>
              {errors.phoneNumbers && (
                <p className="text-sm text-red-600">{errors.phoneNumbers}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Google Register Button */}
          <button
            onClick={() => googleRegisterHandler()}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              {loading ? "Processing..." : "Sign up with Google"}
            </span>
          </button>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ID Number Modal for Google Registration */}
      {showIdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-semibold mb-4">
              Complete Your Google Registration
            </h3>
            <p className="text-gray-600 mb-6">
              Please enter your Kenyan ID number to continue.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Number (Kenyan)
                </label>
                <div className="relative">
                  <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, idNumber: e.target.value })
                    }
                    className="input-field pl-10"
                    placeholder="12345678"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  7-8 digit ID number
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowIdModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button onClick={handleIdSubmit} className="btn-primary flex-1">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phone Number Modal for Google Registration */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-semibold mb-4">
              Complete Your Google Registration
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
                    value={formData.phoneNumbers[0]}
                    onChange={(e) => handlePhoneChange(0, e.target.value)}
                    className="input-field pl-10"
                    placeholder="0712345678"
                    required
                    autoFocus
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
                    value={formData.phoneNumbers[1]}
                    onChange={(e) => handlePhoneChange(1, e.target.value)}
                    className="input-field pl-10"
                    placeholder="0733456789"
                    required
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Ensure you have access to these numbers for verification
                purposes.
              </p>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPhoneModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGooglePhoneSubmit}
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
