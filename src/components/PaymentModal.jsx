import React, { useState } from "react";
import { FiX, FiDollarSign, FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";

const PaymentModal = ({ loan, onClose, onSubmit }) => {
  const [paymentData, setPaymentData] = useState({
    amount: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const remainingBalance = loan.totalAmount - (loan.amountPaid || 0);
  const isFullPayment = paymentData.amount == remainingBalance;

  const validate = () => {
    const newErrors = {};
    const amount = parseFloat(paymentData.amount);

    if (!paymentData.amount || amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (amount > remainingBalance) {
      newErrors.amount = `Amount cannot exceed remaining balance of KES ${remainingBalance.toLocaleString()}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(loan._id, {
        amount: parseFloat(paymentData.amount),
        notes: paymentData.notes,
      });
      toast.success("Payment processed successfully");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (percentage) => {
    const amount = (remainingBalance * percentage) / 100;
    setPaymentData({
      ...paymentData,
      amount: Math.round(amount),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">Process Payment</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Loan Summary */}
        <div className="p-4 bg-primary-50 border-b">
          <p className="text-xs text-gray-600 mb-2">Loan #{loan.loanNumber}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="font-semibold text-base">
                KES {loan.totalAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Amount Paid</p>
              <p className="font-semibold text-base text-green-600">
                KES {loan.amountPaid?.toLocaleString() || 0}
              </p>
            </div>
            <div className="col-span-2 bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-500">Remaining Balance</p>
              <p className="font-semibold text-xl text-primary-600">
                KES {remainingBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount (KES)
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={paymentData.amount}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, amount: e.target.value })
                }
                className={`input-field pl-10 ${errors.amount ? "border-red-500" : ""}`}
                placeholder="Enter amount"
                min="1"
                max={remainingBalance}
                step="any"
                required
                disabled={loading}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <p className="text-xs text-gray-600 mb-2">Quick amounts:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickAmount(25)}
                className="px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={loading}
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => handleQuickAmount(50)}
                className="px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={loading}
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => handleQuickAmount(100)}
                className="px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={loading}
              >
                Full Amount
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={paymentData.notes}
              onChange={(e) =>
                setPaymentData({ ...paymentData, notes: e.target.value })
              }
              className="input-field text-sm"
              placeholder="Add any notes about this payment"
              rows="2"
              disabled={loading}
            />
          </div>

          {/* Status Preview */}
          <div
            className={`p-3 rounded-lg text-sm ${
              isFullPayment
                ? "bg-green-50 text-green-800"
                : "bg-blue-50 text-blue-800"
            }`}
          >
            <div className="flex items-start space-x-2">
              <FiInfo className="mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="font-medium mb-1">
                  {isFullPayment ? "Full Payment" : "Partial Payment"}
                </p>
                <p className="text-xs">
                  {isFullPayment
                    ? "This will mark the loan as PAID and update the user's credit score."
                    : "This will keep the loan in PARTIAL status until fully paid."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-2 text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 py-2 text-sm"
              disabled={loading}
            >
              {loading ? "Processing..." : "Process Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
