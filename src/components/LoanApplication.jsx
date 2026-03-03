import React, { useState } from "react";
import { FiX } from "react-icons/fi";

const LoanApplication = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount < 100) {
      newErrors.amount = "Amount must be at least KES 100";
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = "Please specify the loan purpose";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Apply for Loan</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount (KES)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className={`input-field ${errors.amount ? "border-red-500" : ""}`}
              placeholder="Enter amount"
              min="100"
              required
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Purpose
            </label>
            <textarea
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              className={`input-field ${errors.purpose ? "border-red-500" : ""}`}
              placeholder="What will the loan be used for?"
              rows="3"
              required
            />
            {errors.purpose && (
              <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> By applying for this loan, you agree to our
              terms and conditions. Interest rate is 10% per month.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplication;
