import React, { useState } from "react";
import { FiX, FiLock, FiEye, FiEyeOff, FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";

const ChangePasswordModal = ({
  onClose,
  onSubmit,
  hasExistingPassword = true,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Only validate current password if user has existing password
    if (hasExistingPassword && !formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Check if new password is different from current (only if has existing password)
    if (
      hasExistingPassword &&
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const submitData = {
          newPassword: formData.newPassword,
        };

        // Only include currentPassword if user has existing password
        if (hasExistingPassword) {
          submitData.currentPassword = formData.currentPassword;
        }

        await onSubmit(submitData);
        toast.success(
          hasExistingPassword
            ? "Password changed successfully!"
            : "Password set successfully!",
        );
        onClose();
      } catch (error) {
        console.error("Password change error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {hasExistingPassword ? "Change Password" : "Set Password"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Info message for Google users */}
        {!hasExistingPassword && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start space-x-2">
            <FiInfo className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              You're setting a password for your Google account. This will allow
              you to log in with email and password in addition to Google.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password - only show if user has existing password */}
          {hasExistingPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                  className={`input-field pl-10 pr-10 ${errors.currentPassword ? "border-red-500" : ""}`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.current ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.currentPassword}
                </p>
              )}
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {hasExistingPassword ? "New Password" : "Password"}
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className={`input-field pl-10 pr-10 ${errors.newPassword ? "border-red-500" : ""}`}
                placeholder={
                  hasExistingPassword ? "Enter new password" : "Enter password"
                }
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.new ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm {hasExistingPassword ? "New " : ""}Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className={`input-field pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.confirm ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-1">
              Password Requirements:
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li
                className={
                  formData.newPassword.length >= 6 ? "text-green-700" : ""
                }
              >
                ✓ At least 6 characters long
              </li>
              {hasExistingPassword && (
                <li
                  className={
                    formData.newPassword !== formData.currentPassword &&
                    formData.newPassword
                      ? "text-green-700"
                      : ""
                  }
                >
                  ✓ Different from current password
                </li>
              )}
              <li
                className={
                  formData.newPassword === formData.confirmPassword &&
                  formData.newPassword
                    ? "text-green-700"
                    : ""
                }
              >
                ✓ Passwords match
              </li>
            </ul>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : hasExistingPassword
                  ? "Change Password"
                  : "Set Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
