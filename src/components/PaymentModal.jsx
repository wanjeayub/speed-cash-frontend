import React, { useState } from "react";
import { FiX, FiDollarSign } from "react-icons/fi";

const PaymentModal = ({ loan, onClose, onSubmit }) => {
  const [paymentData, setPaymentData] = useState({
    amount: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const remainingBalance = loan.totalAmount - (loan.amountPaid || 0);

  const validate = () => {
    const newErrors = {};

    if (!paymentData.amount || paymentData.amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (paymentData.amount > remainingBalance) {
      newErrors.amount = `Amount cannot exceed remaining balance of KES ${remainingBalance.toLocaleString()}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(loan._id, {
        amount: parseFloat(paymentData.amount),
        notes: paymentData.notes,
      });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Process Payment</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Loan Summary */}
        <div className="p-6 bg-primary-50 border-b">
          <p className="text-sm text-gray-600 mb-2">Loan #{loan.loanNumber}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="font-semibold text-lg">
                KES {loan.totalAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Amount Paid</p>
              <p className="font-semibold text-lg text-green-600">
                KES {loan.amountPaid?.toLocaleString() || 0}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Remaining Balance</p>
              <p className="font-semibold text-2xl text-primary-600">
                KES {remainingBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Quick amounts:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickAmount(25)}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => handleQuickAmount(50)}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => handleQuickAmount(100)}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
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
              className="input-field"
              placeholder="Add any notes about this payment"
              rows="3"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After processing this payment, the loan
              status will be updated:
              {paymentData.amount == remainingBalance ? (
                <span className="block mt-1 font-medium">
                  ✓ Loan will be marked as PAID
                </span>
              ) : (
                <span className="block mt-1 font-medium">
                  ↻ Loan will remain in PARTIAL status
                </span>
              )}
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
              Process Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
