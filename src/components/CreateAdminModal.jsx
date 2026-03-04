import React, { useState } from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiCreditCard,
} from "react-icons/fi";
import { adminService } from "../services/admin.service";
import toast from "react-hot-toast";

const CreateAdminModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    idNumber: "",
    phoneNumbers: ["", ""],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Valid email is required";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.idNumber.match(/^\d{7,8}$/)) {
      newErrors.idNumber = "Valid Kenyan ID (7-8 digits) required";
    }

    const phoneRegex = /^0\d{9}$/;
    if (
      !formData.phoneNumbers[0] ||
      !phoneRegex.test(formData.phoneNumbers[0])
    ) {
      newErrors.phone0 = "Valid primary phone required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await adminService.createAdmin({
        ...formData,
        phoneNumbers: formData.phoneNumbers.filter((p) => p.trim() !== ""),
      });
      toast.success("Admin created successfully");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">Create New Admin</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className={`input-field ${errors.firstName ? "border-red-500" : ""}`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className={`input-field ${errors.lastName ? "border-red-500" : ""}`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`input-field ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={`input-field ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ID Number</label>
            <input
              type="text"
              value={formData.idNumber}
              onChange={(e) =>
                setFormData({ ...formData, idNumber: e.target.value })
              }
              className={`input-field ${errors.idNumber ? "border-red-500" : ""}`}
              placeholder="12345678"
            />
            {errors.idNumber && (
              <p className="text-xs text-red-600 mt-1">{errors.idNumber}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Phone Numbers</label>
            <input
              type="tel"
              value={formData.phoneNumbers[0]}
              onChange={(e) => {
                const newPhones = [...formData.phoneNumbers];
                newPhones[0] = e.target.value;
                setFormData({ ...formData, phoneNumbers: newPhones });
              }}
              className={`input-field ${errors.phone0 ? "border-red-500" : ""}`}
              placeholder="Primary: 0712345678"
            />
            {errors.phone0 && (
              <p className="text-xs text-red-600">{errors.phone0}</p>
            )}

            <input
              type="tel"
              value={formData.phoneNumbers[1]}
              onChange={(e) => {
                const newPhones = [...formData.phoneNumbers];
                newPhones[1] = e.target.value;
                setFormData({ ...formData, phoneNumbers: newPhones });
              }}
              className="input-field"
              placeholder="Secondary: 0733456789 (optional)"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal;
