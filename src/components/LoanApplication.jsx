import React, { useState, useEffect } from "react";
import { FiX, FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../services/api"; // Import your API service

const LoanApplication = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: "",
    productType: "one_month",
    tenureMonths: 4,
    purpose: "",
  });

  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [calculation, setCalculation] = useState(null);
  const [loanSettings, setLoanSettings] = useState({
    oneMonthLoan: {
      interestRate: 10,
      minAmount: 100,
      maxAmount: 1000000,
      loanTermDays: 30,
    },
    installmentLoan: {
      interestRate: 20,
      minAmount: 1000,
      maxAmount: 1000000,
      minTenure: 2,
      maxTenure: 4,
    },
  });

  // Fetch loan settings from admin
  useEffect(() => {
    fetchLoanSettings();
  }, []);

  const fetchLoanSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await api.get("/admin/settings");
      if (response.data.success) {
        setLoanSettings(response.data.settings.loanSettings);
        // Set default tenure based on settings
        setFormData((prev) => ({
          ...prev,
          tenureMonths:
            response.data.settings.loanSettings.installmentLoan.maxTenure || 4,
        }));
      }
    } catch (error) {
      console.error("Error fetching loan settings:", error);
      toast.error("Failed to load loan settings. Using default values.");
    } finally {
      setSettingsLoading(false);
    }
  };

  // Calculate loan details based on product type and admin settings
  const calculateLoan = () => {
    const amount = parseFloat(formData.amount) || 0;
    const minAmount =
      formData.productType === "one_month"
        ? loanSettings.oneMonthLoan.minAmount
        : loanSettings.installmentLoan.minAmount;

    if (amount < minAmount) return null;

    if (formData.productType === "one_month") {
      const interestRate = loanSettings.oneMonthLoan.interestRate / 100;
      const interest = amount * interestRate;
      const total = amount + interest;

      return {
        type: "One Month Loan",
        interestRate: `${loanSettings.oneMonthLoan.interestRate}%`,
        totalRepayment: total,
        interestAmount: interest,
        breakdown: [
          { label: "Principal", amount },
          {
            label: `Interest (${loanSettings.oneMonthLoan.interestRate}%)`,
            amount: interest,
          },
          { label: "Total Repayment", amount: total, highlight: true },
        ],
        termDays: loanSettings.oneMonthLoan.loanTermDays,
      };
    } else {
      // Installment loan with reducing balance
      const tenure = formData.tenureMonths;
      const monthlyInterestRate =
        loanSettings.installmentLoan.interestRate / 100;
      const monthlyPrincipal = amount / tenure;
      let remainingBalance = amount;
      const schedule = [];
      let totalRepayment = 0;

      for (let i = 1; i <= tenure; i++) {
        const interestPortion = remainingBalance * monthlyInterestRate;
        const principalPortion = monthlyPrincipal;
        const installmentTotal = principalPortion + interestPortion;

        schedule.push({
          month: i,
          principal: principalPortion,
          interest: interestPortion,
          total: installmentTotal,
          remainingBalance: remainingBalance - principalPortion,
        });

        totalRepayment += installmentTotal;
        remainingBalance -= monthlyPrincipal;
      }

      return {
        type: `${tenure} Month Installment Loan`,
        interestRate: `${loanSettings.installmentLoan.interestRate}% (reducing balance)`,
        totalRepayment,
        interestAmount: totalRepayment - amount,
        schedule,
        breakdown: [
          { label: "Principal", amount },
          { label: "Total Interest", amount: totalRepayment - amount },
          { label: "Total Repayment", amount: totalRepayment, highlight: true },
        ],
      };
    }
  };

  // Update calculation when inputs change
  useEffect(() => {
    const minAmount =
      formData.productType === "one_month"
        ? loanSettings.oneMonthLoan.minAmount
        : loanSettings.installmentLoan.minAmount;

    if (formData.amount >= minAmount) {
      setCalculation(calculateLoan());
    } else {
      setCalculation(null);
    }
  }, [
    formData.amount,
    formData.productType,
    formData.tenureMonths,
    loanSettings,
  ]);

  const validate = () => {
    const newErrors = {};
    const amount = parseFloat(formData.amount);
    const minAmount =
      formData.productType === "one_month"
        ? loanSettings.oneMonthLoan.minAmount
        : loanSettings.installmentLoan.minAmount;
    const maxAmount =
      formData.productType === "one_month"
        ? loanSettings.oneMonthLoan.maxAmount
        : loanSettings.installmentLoan.maxAmount;

    if (!formData.amount || amount < minAmount) {
      newErrors.amount = `Amount must be at least KES ${minAmount.toLocaleString()}`;
    } else if (amount > maxAmount) {
      newErrors.amount = `Amount cannot exceed KES ${maxAmount.toLocaleString()}`;
    }

    if (formData.productType === "installment") {
      if (
        formData.tenureMonths < loanSettings.installmentLoan.minTenure ||
        formData.tenureMonths > loanSettings.installmentLoan.maxTenure
      ) {
        newErrors.tenure = `Tenure must be between ${loanSettings.installmentLoan.minTenure} and ${loanSettings.installmentLoan.maxTenure} months`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const loanData = {
          amount: parseFloat(formData.amount),
          productType: formData.productType,
          purpose:
            formData.purpose?.trim() ||
            loanSettings.defaultLoanPurpose ||
            "Personal use",
        };

        if (formData.productType === "installment") {
          loanData.tenureMonths = formData.tenureMonths;
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

  if (settingsLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading loan products...</p>
        </div>
      </div>
    );
  }

  const minAmount =
    formData.productType === "one_month"
      ? loanSettings.oneMonthLoan.minAmount
      : loanSettings.installmentLoan.minAmount;
  const maxAmount =
    formData.productType === "one_month"
      ? loanSettings.oneMonthLoan.maxAmount
      : loanSettings.installmentLoan.maxAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">Apply for Loan</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Loan Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Loan Product
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  formData.productType === "one_month"
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-primary-300"
                }`}
              >
                <input
                  type="radio"
                  name="productType"
                  value="one_month"
                  checked={formData.productType === "one_month"}
                  onChange={(e) =>
                    setFormData({ ...formData, productType: e.target.value })
                  }
                  className="sr-only"
                />
                <div className="flex items-start">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 ${
                      formData.productType === "one_month"
                        ? "border-primary-600 bg-primary-600"
                        : "border-gray-400"
                    }`}
                  >
                    {formData.productType === "one_month" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">One Month Loan</h3>
                    <p className="text-sm text-gray-600">
                      {loanSettings.oneMonthLoan.interestRate}% interest, repay
                      in {loanSettings.oneMonthLoan.loanTermDays} days
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Simple interest, one payment • Min: KES{" "}
                      {minAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  formData.productType === "installment"
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-primary-300"
                }`}
              >
                <input
                  type="radio"
                  name="productType"
                  value="installment"
                  checked={formData.productType === "installment"}
                  onChange={(e) =>
                    setFormData({ ...formData, productType: e.target.value })
                  }
                  className="sr-only"
                />
                <div className="flex items-start">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 ${
                      formData.productType === "installment"
                        ? "border-primary-600 bg-primary-600"
                        : "border-gray-400"
                    }`}
                  >
                    {formData.productType === "installment" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">Installment Loan</h3>
                    <p className="text-sm text-gray-600">
                      {loanSettings.installmentLoan.interestRate}% interest,
                      reducing balance
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Monthly payments •{" "}
                      {loanSettings.installmentLoan.minTenure}-
                      {loanSettings.installmentLoan.maxTenure} months
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Tenure Selection (for installment loans) */}
          {formData.productType === "installment" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repayment Tenure (Months)
              </label>
              <select
                value={formData.tenureMonths}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tenureMonths: parseInt(e.target.value),
                  })
                }
                className={`input-field ${errors.tenure ? "border-red-500" : ""}`}
              >
                {Array.from(
                  {
                    length:
                      loanSettings.installmentLoan.maxTenure -
                      loanSettings.installmentLoan.minTenure +
                      1,
                  },
                  (_, i) => i + loanSettings.installmentLoan.minTenure,
                ).map((months) => (
                  <option key={months} value={months}>
                    {months} Months
                  </option>
                ))}
              </select>
              {errors.tenure && (
                <p className="mt-1 text-sm text-red-600">{errors.tenure}</p>
              )}
            </div>
          )}

          {/* Loan Amount */}
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
              placeholder={`Enter amount (Min: KES ${minAmount.toLocaleString()})`}
              min={minAmount}
              max={maxAmount}
              step="100"
              required
              disabled={loading}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Min: KES {minAmount.toLocaleString()} | Max: KES{" "}
              {maxAmount.toLocaleString()}
            </p>
          </div>

          {/* Loan Calculation Display */}
          {calculation && (
            <div className="bg-primary-50 rounded-xl p-4">
              <h3 className="font-semibold mb-3">Loan Summary</h3>

              {/* Breakdown */}
              <div className="space-y-2 mb-4">
                {calculation.breakdown.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between text-sm ${
                      item.highlight ? "font-bold text-primary-700" : ""
                    }`}
                  >
                    <span>{item.label}</span>
                    <span>
                      KES{" "}
                      {item.amount.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Installment Schedule for installment loans */}
              {calculation.schedule && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">
                    Repayment Schedule
                  </h4>
                  <div className="bg-white rounded-lg overflow-hidden">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left">Month</th>
                          <th className="px-3 py-2 text-right">Principal</th>
                          <th className="px-3 py-2 text-right">Interest</th>
                          <th className="px-3 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculation.schedule.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-3 py-2">{item.month}</td>
                            <td className="px-3 py-2 text-right">
                              KES{" "}
                              {item.principal.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                            </td>
                            <td className="px-3 py-2 text-right">
                              KES{" "}
                              {item.interest.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                            </td>
                            <td className="px-3 py-2 text-right font-medium">
                              KES{" "}
                              {item.total.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    * Interest calculated on reducing balance at{" "}
                    {loanSettings.installmentLoan.interestRate}% per month
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Purpose (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Purpose (Optional)
            </label>
            <textarea
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              className="input-field"
              placeholder="What will the loan be used for?"
              rows="2"
              disabled={loading}
            />
          </div>

          {/* Terms Agreement */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <FiInfo className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800">
                By submitting this application, you agree to our{" "}
                <Link to="/terms" className="font-medium underline">
                  Terms and Conditions
                </Link>
                . Late payments may affect your credit score and result in
                additional fees of {loanSettings.latePaymentPenalty || 5}%.
              </p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-3"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 py-3"
              disabled={loading || !calculation || settingsLoading}
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
