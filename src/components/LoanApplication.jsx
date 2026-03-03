import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const LoanApplication = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount < 100) {
      newErrors.amount = "Amount must be at least KES 100";
    } else if (formData.amount > 1000000) {
      newErrors.amount = "Amount cannot exceed KES 1,000,000";
    }

    // Purpose is now optional - only validate if provided
    if (formData.purpose && formData.purpose.trim().length < 3) {
      newErrors.purpose = "Purpose must be at least 3 characters if provided";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        // Only include purpose if it's not empty
        const loanData = {
          amount: parseFloat(formData.amount),
        };

        // Add purpose only if it has content
        if (formData.purpose && formData.purpose.trim()) {
          loanData.purpose = formData.purpose.trim();
        }

        await onSubmit(loanData);
        toast.success("Loan application submitted successfully!");
        onClose();
      } catch (error) {
        console.error("Loan application error:", error);
        toast.error(error.message || "Failed to submit loan application");
      } finally {
        setLoading(false);
      }
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
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount (KES) <span className="text-red-500">*</span>
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
              max="1000000"
              step="100"
              required
              disabled={loading}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Min: KES 100 | Max: KES 1,000,000
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Purpose (Optional)
            </label>
            <textarea
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              className={`input-field ${errors.purpose ? "border-red-500" : ""}`}
              placeholder="What will the loan be used for? (e.g., Business expansion, School fees, Medical emergency)"
              rows="3"
              disabled={loading}
            />
            {errors.purpose && (
              <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              You can leave this blank if you prefer not to specify
            </p>
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
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplication;
