import React, { useState, useEffect } from "react";
import { FiX, FiInfo, FiClock, FiSun } from "react-icons/fi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import publicService from "../services/public.service";

const LoanApplication = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: "",
    productType: "one_month",
    tenureMonths: 4,
    tenureWeeks: 1,
    purpose: "",
  });

  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [calculation, setCalculation] = useState(null);
  const [loanSettings, setLoanSettings] = useState({
    oneMonthLoan: {
      interestRate: 20,
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
    weeklyLoan: {
      interestRate: 10,
      minAmount: 500,
      maxAmount: 500000,
      minWeeks: 1,
      maxWeeks: 3,
    },
    twentyFourHrLoan: {
      interestRate: 5,
      minAmount: 100,
      maxAmount: 100000,
    },
    latePaymentPenalty: 5,
    defaultLoanPurpose: "Personal use",
  });

  // Fetch loan settings from public endpoint
  useEffect(() => {
    fetchLoanSettings();
  }, []);

  const fetchLoanSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await publicService.getLoanSettings();
      if (response.success && response.settings?.loanSettings) {
        const settings = response.settings.loanSettings;
        setLoanSettings({
          oneMonthLoan: {
            ...loanSettings.oneMonthLoan,
            ...(settings.oneMonthLoan || {}),
          },
          installmentLoan: {
            ...loanSettings.installmentLoan,
            ...(settings.installmentLoan || {}),
          },
          weeklyLoan: {
            ...loanSettings.weeklyLoan,
            ...(settings.weeklyLoan || {}),
          },
          twentyFourHrLoan: {
            ...loanSettings.twentyFourHrLoan,
            ...(settings.twentyFourHrLoan || {}),
          },
          latePaymentPenalty:
            settings.latePaymentPenalty ?? loanSettings.latePaymentPenalty,
          defaultLoanPurpose:
            settings.defaultLoanPurpose ?? loanSettings.defaultLoanPurpose,
        });

        // Set default tenures based on settings
        setFormData((prev) => ({
          ...prev,
          tenureMonths: settings.installmentLoan?.maxTenure || 4,
          tenureWeeks: settings.weeklyLoan?.maxWeeks || 1,
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

    if (!loanSettings) return null;

    if (formData.productType === "one_month") {
      const minAmount = loanSettings.oneMonthLoan?.minAmount || 100;
      if (amount < minAmount) return null;

      const interestRate =
        (loanSettings.oneMonthLoan?.interestRate || 20) / 100;
      const interest = amount * interestRate;
      const total = amount + interest;

      return {
        type: "One Month Loan",
        interestRate: `${loanSettings.oneMonthLoan?.interestRate || 20}%`,
        totalRepayment: total,
        interestAmount: interest,
        periodAmount: total,
        numberOfPeriods: 1,
        periodLabel: "One payment",
        breakdown: [
          { label: "Principal", amount },
          {
            label: `Interest (${loanSettings.oneMonthLoan?.interestRate || 20}%)`,
            amount: interest,
          },
          { label: "Total Repayment", amount: total, highlight: true },
        ],
        termDays: loanSettings.oneMonthLoan?.loanTermDays || 30,
      };
    } else if (formData.productType === "twenty_four_hr") {
      const minAmount = loanSettings.twentyFourHrLoan?.minAmount || 100;
      if (amount < minAmount) return null;

      const interestRate =
        (loanSettings.twentyFourHrLoan?.interestRate || 5) / 100;
      const interest = amount * interestRate;
      const total = amount + interest;

      return {
        type: "24 Hour Loan",
        interestRate: `${loanSettings.twentyFourHrLoan?.interestRate || 5}%`,
        totalRepayment: total,
        interestAmount: interest,
        periodAmount: total,
        numberOfPeriods: 1,
        periodLabel: "One payment (next day)",
        breakdown: [
          { label: "Principal", amount },
          {
            label: `Interest (${loanSettings.twentyFourHrLoan?.interestRate || 5}%)`,
            amount: interest,
          },
          { label: "Total Repayment", amount: total, highlight: true },
        ],
      };
    } else if (formData.productType === "installment") {
      const minAmount = loanSettings.installmentLoan?.minAmount || 1000;
      if (amount < minAmount) return null;

      const tenure = formData.tenureMonths;
      const monthlyInterestRate =
        (loanSettings.installmentLoan?.interestRate || 20) / 100;
      const monthlyPrincipal = amount / tenure;
      let remainingBalance = amount;
      const schedule = [];
      let totalRepayment = 0;

      for (let i = 1; i <= tenure; i++) {
        const interestPortion = remainingBalance * monthlyInterestRate;
        const principalPortion = monthlyPrincipal;
        const installmentTotal = principalPortion + interestPortion;

        schedule.push({
          period: i,
          principal: principalPortion,
          interest: interestPortion,
          total: installmentTotal,
        });

        totalRepayment += installmentTotal;
        remainingBalance -= monthlyPrincipal;
      }

      return {
        type: `${tenure} Month Installment Loan`,
        interestRate: `${loanSettings.installmentLoan?.interestRate || 20}% (reducing balance)`,
        totalRepayment,
        interestAmount: totalRepayment - amount,
        periodAmount: schedule[0]?.total || 0,
        numberOfPeriods: tenure,
        periodLabel: "monthly payment",
        schedule,
        breakdown: [
          { label: "Principal", amount },
          { label: "Total Interest", amount: totalRepayment - amount },
          { label: "Total Repayment", amount: totalRepayment, highlight: true },
        ],
      };
    } else if (formData.productType === "weekly") {
      const minAmount = loanSettings.weeklyLoan?.minAmount || 500;
      if (amount < minAmount) return null;

      const weeks = formData.tenureWeeks;
      const weeklyInterestRate =
        (loanSettings.weeklyLoan?.interestRate || 10) / 100;
      const weeklyPrincipal = amount / weeks;
      let remainingBalance = amount;
      const schedule = [];
      let totalRepayment = 0;

      for (let i = 1; i <= weeks; i++) {
        const interestPortion = remainingBalance * weeklyInterestRate;
        const principalPortion = weeklyPrincipal;
        const weeklyTotal = principalPortion + interestPortion;

        schedule.push({
          period: i,
          principal: principalPortion,
          interest: interestPortion,
          total: weeklyTotal,
        });

        totalRepayment += weeklyTotal;
        remainingBalance -= weeklyPrincipal;
      }

      return {
        type: `${weeks} Week Loan`,
        interestRate: `${loanSettings.weeklyLoan?.interestRate || 10}% (reducing balance)`,
        totalRepayment,
        interestAmount: totalRepayment - amount,
        periodAmount: schedule[0]?.total || 0,
        numberOfPeriods: weeks,
        periodLabel: "weekly payment",
        schedule,
        breakdown: [
          { label: "Principal", amount },
          { label: "Total Interest", amount: totalRepayment - amount },
          { label: "Total Repayment", amount: totalRepayment, highlight: true },
        ],
      };
    }

    return null;
  };

  // Update calculation when inputs change
  useEffect(() => {
    if (formData.amount >= 100 && !settingsLoading) {
      setCalculation(calculateLoan());
    } else {
      setCalculation(null);
    }
  }, [
    formData.amount,
    formData.productType,
    formData.tenureMonths,
    formData.tenureWeeks,
    settingsLoading,
  ]);

  const validate = () => {
    const newErrors = {};
    const amount = parseFloat(formData.amount);

    if (!loanSettings) return false;

    let minAmount, maxAmount;

    switch (formData.productType) {
      case "one_month":
        minAmount = loanSettings.oneMonthLoan?.minAmount || 100;
        maxAmount = loanSettings.oneMonthLoan?.maxAmount || 1000000;
        break;
      case "twenty_four_hr":
        minAmount = loanSettings.twentyFourHrLoan?.minAmount || 100;
        maxAmount = loanSettings.twentyFourHrLoan?.maxAmount || 100000;
        break;
      case "installment":
        minAmount = loanSettings.installmentLoan?.minAmount || 1000;
        maxAmount = loanSettings.installmentLoan?.maxAmount || 1000000;
        if (
          formData.tenureMonths <
            (loanSettings.installmentLoan?.minTenure || 2) ||
          formData.tenureMonths > (loanSettings.installmentLoan?.maxTenure || 4)
        ) {
          newErrors.tenure = `Tenure must be between ${loanSettings.installmentLoan?.minTenure || 2} and ${loanSettings.installmentLoan?.maxTenure || 4} months`;
        }
        break;
      case "weekly":
        minAmount = loanSettings.weeklyLoan?.minAmount || 500;
        maxAmount = loanSettings.weeklyLoan?.maxAmount || 500000;
        if (
          formData.tenureWeeks < (loanSettings.weeklyLoan?.minWeeks || 1) ||
          formData.tenureWeeks > (loanSettings.weeklyLoan?.maxWeeks || 3)
        ) {
          newErrors.tenure = `Tenure must be between ${loanSettings.weeklyLoan?.minWeeks || 1} and ${loanSettings.weeklyLoan?.maxWeeks || 3} weeks`;
        }
        break;
      default:
        minAmount = 100;
        maxAmount = 1000000;
    }

    if (!formData.amount || amount < minAmount) {
      newErrors.amount = `Amount must be at least KES ${minAmount.toLocaleString()}`;
    } else if (amount > maxAmount) {
      newErrors.amount = `Amount cannot exceed KES ${maxAmount.toLocaleString()}`;
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
        } else if (formData.productType === "weekly") {
          loanData.tenureWeeks = formData.tenureWeeks;
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

  const getMinAmount = () => {
    if (!loanSettings) return 100;
    switch (formData.productType) {
      case "one_month":
        return loanSettings.oneMonthLoan?.minAmount || 100;
      case "twenty_four_hr":
        return loanSettings.twentyFourHrLoan?.minAmount || 100;
      case "installment":
        return loanSettings.installmentLoan?.minAmount || 1000;
      case "weekly":
        return loanSettings.weeklyLoan?.minAmount || 500;
      default:
        return 100;
    }
  };

  const getMaxAmount = () => {
    if (!loanSettings) return 1000000;
    switch (formData.productType) {
      case "one_month":
        return loanSettings.oneMonthLoan?.maxAmount || 1000000;
      case "twenty_four_hr":
        return loanSettings.twentyFourHrLoan?.maxAmount || 100000;
      case "installment":
        return loanSettings.installmentLoan?.maxAmount || 1000000;
      case "weekly":
        return loanSettings.weeklyLoan?.maxAmount || 500000;
      default:
        return 1000000;
    }
  };

  if (!loanSettings) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-8 text-center">
          <p className="text-red-600">
            Error loading loan settings. Please try again.
          </p>
          <button onClick={onClose} className="mt-4 btn-primary">
            Close
          </button>
        </div>
      </div>
    );
  }

  const minAmount = getMinAmount();
  const maxAmount = getMaxAmount();

  const getTenureOptions = (type) => {
    switch (type) {
      case "installment":
        const minMonths = loanSettings.installmentLoan?.minTenure || 2;
        const maxMonths = loanSettings.installmentLoan?.maxTenure || 4;
        return Array.from(
          { length: maxMonths - minMonths + 1 },
          (_, i) => i + minMonths,
        );
      case "weekly":
        const minWeeks = loanSettings.weeklyLoan?.minWeeks || 1;
        const maxWeeks = loanSettings.weeklyLoan?.maxWeeks || 3;
        return Array.from(
          { length: maxWeeks - minWeeks + 1 },
          (_, i) => i + minWeeks,
        );
      default:
        return [];
    }
  };

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
              {/* One Month Loan */}
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
                      {loanSettings.oneMonthLoan?.interestRate || 20}% interest,
                      repay in {loanSettings.oneMonthLoan?.loanTermDays || 30}{" "}
                      days
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Simple interest, one payment • Min: KES{" "}
                      {(
                        loanSettings.oneMonthLoan?.minAmount || 100
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </label>

              {/* 24 Hour Loan */}
              <label
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  formData.productType === "twenty_four_hr"
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-primary-300"
                }`}
              >
                <input
                  type="radio"
                  name="productType"
                  value="twenty_four_hr"
                  checked={formData.productType === "twenty_four_hr"}
                  onChange={(e) =>
                    setFormData({ ...formData, productType: e.target.value })
                  }
                  className="sr-only"
                />
                <div className="flex items-start">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 ${
                      formData.productType === "twenty_four_hr"
                        ? "border-primary-600 bg-primary-600"
                        : "border-gray-400"
                    }`}
                  >
                    {formData.productType === "twenty_four_hr" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center">
                      <FiSun className="mr-1" size={16} />
                      24 Hour Loan
                    </h3>
                    <p className="text-sm text-gray-600">
                      {loanSettings.twentyFourHrLoan?.interestRate || 5}%
                      interest, repay next day
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Quick cash for emergencies • Min: KES{" "}
                      {(
                        loanSettings.twentyFourHrLoan?.minAmount || 100
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </label>

              {/* Weekly Loan */}
              <label
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  formData.productType === "weekly"
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-primary-300"
                }`}
              >
                <input
                  type="radio"
                  name="productType"
                  value="weekly"
                  checked={formData.productType === "weekly"}
                  onChange={(e) =>
                    setFormData({ ...formData, productType: e.target.value })
                  }
                  className="sr-only"
                />
                <div className="flex items-start">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 ${
                      formData.productType === "weekly"
                        ? "border-primary-600 bg-primary-600"
                        : "border-gray-400"
                    }`}
                  >
                    {formData.productType === "weekly" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center">
                      <FiClock className="mr-1" size={16} />
                      Weekly Loan
                    </h3>
                    <p className="text-sm text-gray-600">
                      {loanSettings.weeklyLoan?.interestRate || 10}% interest,
                      weekly payments
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {loanSettings.weeklyLoan?.minWeeks || 1}-
                      {loanSettings.weeklyLoan?.maxWeeks || 3} weeks • Min: KES{" "}
                      {(
                        loanSettings.weeklyLoan?.minAmount || 500
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </label>

              {/* Monthly Installment Loan */}
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
                    <h3 className="font-semibold">Monthly Installment</h3>
                    <p className="text-sm text-gray-600">
                      {loanSettings.installmentLoan?.interestRate || 20}%
                      interest, monthly payments
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {loanSettings.installmentLoan?.minTenure || 2}-
                      {loanSettings.installmentLoan?.maxTenure || 4} months •
                      Min: KES{" "}
                      {(
                        loanSettings.installmentLoan?.minAmount || 1000
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Tenure Selection based on product type */}
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
                {getTenureOptions("installment").map((months) => (
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

          {formData.productType === "weekly" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repayment Tenure (Weeks)
              </label>
              <select
                value={formData.tenureWeeks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tenureWeeks: parseInt(e.target.value),
                  })
                }
                className={`input-field ${errors.tenure ? "border-red-500" : ""}`}
              >
                {getTenureOptions("weekly").map((weeks) => (
                  <option key={weeks} value={weeks}>
                    {weeks} {weeks === 1 ? "Week" : "Weeks"}
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

              {/* Quick Summary */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white p-2 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Periodic Payment</p>
                  <p className="font-bold text-primary-600">
                    KES{" "}
                    {calculation.periodAmount.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {calculation.periodLabel}
                  </p>
                </div>
                <div className="bg-white p-2 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Total Payments</p>
                  <p className="font-bold text-primary-600">
                    {calculation.numberOfPeriods}{" "}
                    {calculation.numberOfPeriods > 1 ? "payments" : "payment"}
                  </p>
                </div>
              </div>

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

              {/* Schedule for installment/weekly loans */}
              {calculation.schedule && calculation.schedule.length <= 10 && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">
                    Repayment Schedule
                  </h4>
                  <div className="bg-white rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left">Period</th>
                          <th className="px-3 py-2 text-right">Principal</th>
                          <th className="px-3 py-2 text-right">Interest</th>
                          <th className="px-3 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculation.schedule.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-3 py-2">{item.period}</td>
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
                    * Interest calculated on reducing balance
                  </p>
                </div>
              )}

              {calculation.schedule && calculation.schedule.length > 10 && (
                <p className="text-xs text-gray-600 mt-2">
                  * {calculation.numberOfPeriods} payments of KES{" "}
                  {calculation.periodAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  each
                </p>
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
