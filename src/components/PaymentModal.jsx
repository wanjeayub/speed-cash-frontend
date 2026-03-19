import React, { useState, useEffect } from "react";
import { FiX, FiDollarSign, FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";

const PaymentModal = ({ loan, onClose, onSubmit }) => {
  const [paymentData, setPaymentData] = useState({
    amount: "",
    notes: "",
    periodNumber: "", // Always store as string
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // Update selected period when periodNumber changes
  useEffect(() => {
    if (paymentData.periodNumber && loan.repaymentSchedule) {
      const periodNumber = parseInt(paymentData.periodNumber, 10);
      const period = loan.repaymentSchedule.find(
        (p) => p.periodNumber === periodNumber,
      );
      setSelectedPeriod(period);

      // Auto-fill amount when period is selected
      if (period && !paymentData.amount) {
        setPaymentData((prev) => ({
          ...prev,
          amount: period.totalAmount,
        }));
      }
    } else {
      setSelectedPeriod(null);
    }
  }, [paymentData.periodNumber, loan.repaymentSchedule]);

  const remainingBalance = loan.totalAmount - (loan.amountPaid || 0);

  // For installment/weekly loans, get next pending period
  const nextPeriod = loan.repaymentSchedule
    ? loan.repaymentSchedule.find(
        (p) => p.status === "pending" || p.status === "overdue",
      )
    : null;

  const getProductTypeLabel = () => {
    switch (loan.productType) {
      case "installment":
        return "Month";
      case "weekly":
        return "Week";
      case "daily":
        return "Day";
      default:
        return "Period";
    }
  };

  const validate = () => {
    const newErrors = {};
    const amount = parseFloat(paymentData.amount);

    if (!paymentData.amount || amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (amount > remainingBalance) {
      newErrors.amount = `Amount cannot exceed remaining balance of KES ${remainingBalance.toLocaleString()}`;
    }

    // For installment and weekly loans, period number is required
    if (
      loan.productType !== "one_month" &&
      loan.productType !== "twenty_four_hr"
    ) {
      if (!paymentData.periodNumber || paymentData.periodNumber.trim() === "") {
        newErrors.periodNumber = `Please select a ${getProductTypeLabel().toLowerCase()} to pay`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const paymentPayload = {
        amount: parseFloat(paymentData.amount),
        notes: paymentData.notes || "",
      };

      // Only include periodNumber for installment and weekly loans
      if (loan.productType === "installment" || loan.productType === "weekly") {
        const periodNumberStr = String(paymentData.periodNumber || "").trim();

        if (!periodNumberStr) {
          toast.error(
            `Please select a ${getProductTypeLabel().toLowerCase()} to pay`,
          );
          setLoading(false);
          return;
        }

        const periodNum = parseInt(periodNumberStr, 10);

        if (isNaN(periodNum) || periodNum <= 0) {
          toast.error("Invalid period number");
          setLoading(false);
          return;
        }

        // FIX: Ensure periodNumber is included as a number
        paymentPayload.periodNumber = periodNum;
      }

      console.log(
        "Sending payment payload:",
        JSON.stringify(paymentPayload, null, 2),
      );
      console.log("Period Number type:", typeof paymentPayload.periodNumber);

      await onSubmit(loan._id, paymentPayload);
      toast.success("Payment processed successfully");
      onClose();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to process payment",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = () => {
    if (
      loan.productType !== "one_month" &&
      loan.productType !== "twenty_four_hr" &&
      nextPeriod
    ) {
      // For installment/weekly loans - pay next period
      setPaymentData({
        ...paymentData,
        amount: nextPeriod.totalAmount,
        periodNumber: String(nextPeriod.periodNumber), // Store as string
      });
    } else {
      // For one_month loans - pay full amount
      setPaymentData({
        ...paymentData,
        amount: remainingBalance,
        // Don't change periodNumber for one_month loans
      });
    }
  };

  const handleFullPayment = () => {
    setPaymentData({
      ...paymentData,
      amount: remainingBalance,
    });
  };

  const handleQuarterPayment = () => {
    const amount = Math.round(remainingBalance * 0.25);
    setPaymentData({
      ...paymentData,
      amount,
    });
  };

  const handleHalfPayment = () => {
    const amount = Math.round(remainingBalance * 0.5);
    setPaymentData({
      ...paymentData,
      amount,
    });
  };

  const isFullPayment =
    parseFloat(paymentData.amount || 0) >= remainingBalance - 0.01; // Small tolerance for floating point

  const getPeriodLabel = () => {
    switch (loan.productType) {
      case "installment":
        return "Month";
      case "weekly":
        return "Week";
      default:
        return "Period";
    }
  };

  const isInstallmentOrWeekly =
    loan.productType === "installment" || loan.productType === "weekly";

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
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-gray-600">Loan #{loan.loanNumber}</p>
            <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
              {loan.productType === "one_month"
                ? "One Month"
                : loan.productType === "installment"
                  ? `${loan.tenureMonths} Months`
                  : loan.productType === "weekly"
                    ? `${loan.tenureWeeks} Weeks`
                    : "24 Hours"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="font-semibold text-base">
                KES {loan.totalAmount?.toLocaleString() || 0}
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
          {/* Period Selection (for installment/weekly loans) */}
          {isInstallmentOrWeekly && loan.repaymentSchedule && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select {getPeriodLabel()} to Pay
              </label>
              <select
                value={paymentData.periodNumber}
                onChange={(e) => {
                  console.log("Selected period value:", e.target.value);
                  setPaymentData({
                    ...paymentData,
                    periodNumber: e.target.value, // Keep as string
                  });
                }}
                className={`input-field ${errors.periodNumber ? "border-red-500" : ""}`}
                disabled={loading}
              >
                <option value="">
                  Choose {getPeriodLabel().toLowerCase()}
                </option>
                {loan.repaymentSchedule
                  .filter((p) => p.status !== "paid")
                  .map((period) => (
                    <option
                      key={period.periodNumber}
                      value={String(period.periodNumber)} // Ensure string value
                    >
                      {getPeriodLabel()} #{period.periodNumber} - Due:{" "}
                      {new Date(period.dueDate).toLocaleDateString()} - KES{" "}
                      {period.totalAmount.toLocaleString()}
                    </option>
                  ))}
              </select>
              {errors.periodNumber && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.periodNumber}
                </p>
              )}
            </div>
          )}

          {/* Next Period Info */}
          {isInstallmentOrWeekly && nextPeriod && !selectedPeriod && (
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="font-medium text-blue-800">Next Payment Due</p>
              <p className="text-xs text-blue-600 mt-1">
                {getPeriodLabel()} #{nextPeriod.periodNumber}: KES{" "}
                {nextPeriod.totalAmount.toLocaleString()}
                <br />
                Due: {new Date(nextPeriod.dueDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Selected Period Info */}
          {selectedPeriod && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-medium text-green-800">
                {getPeriodLabel()} #{selectedPeriod.periodNumber}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div>
                  <span className="text-gray-600">Principal:</span>
                  <br />
                  <span className="font-medium">
                    KES {selectedPeriod.principalPortion?.toLocaleString() || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Interest:</span>
                  <br />
                  <span className="font-medium">
                    KES {selectedPeriod.interestPortion?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Amount */}
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
            <p className="text-xs text-gray-600 mb-2">Quick options:</p>
            <div className="grid grid-cols-3 gap-2">
              {!isInstallmentOrWeekly ? (
                <>
                  <button
                    type="button"
                    onClick={handleQuarterPayment}
                    className="px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={loading}
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    onClick={handleHalfPayment}
                    className="px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={loading}
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={handleFullPayment}
                    className="px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={loading}
                  >
                    Full
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleQuickAmount}
                  className="col-span-3 px-2 py-1.5 text-xs bg-primary-100 hover:bg-primary-200 text-primary-800 rounded-lg transition-colors"
                  disabled={loading || !nextPeriod}
                >
                  Pay Next {getPeriodLabel()}
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
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

          {/* Action Buttons */}
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
