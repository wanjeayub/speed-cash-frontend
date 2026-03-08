import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiSave,
  FiBell,
  FiDollarSign,
  FiTrendingUp,
  FiBriefcase,
  FiShield,
  FiTool,
  FiRefreshCw,
  FiPercent,
  FiCalendar,
  FiCreditCard,
  FiClock,
  FiSun,
} from "react-icons/fi";
import {
  getSettings,
  updateNotificationSettings,
  updateLoanSettings,
  updateCreditThresholds,
} from "../store/slices/adminSettingSlice";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

// Default settings structure
const defaultSettings = {
  notifications: {
    emailNewLoan: true,
    emailPaymentReceived: true,
    smsUrgent: false,
  },
  loanSettings: {
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
    weeklyLoan: {
      interestRate: 10,
      minAmount: 500,
      maxAmount: 500000,
      minWeeks: 2,
      maxWeeks: 8,
    },
    dailyLoan: {
      interestRate: 5,
      minAmount: 100,
      maxAmount: 100000,
      minDays: 3,
      maxDays: 14,
    },
    latePaymentPenalty: 5,
    defaultLoanPurpose: "Personal use",
  },
  creditScoreThresholds: {
    poor: { min: 0, max: 39, color: "#EF4444" },
    fair: { min: 40, max: 69, color: "#FBBF24" },
    good: { min: 70, max: 100, color: "#10B981" },
  },
};

const AdminSettings = () => {
  const dispatch = useDispatch();
  const { settings, loading, saving } = useSelector(
    (state) => state.adminSettings,
  );
  const [activeTab, setActiveTab] = useState("notifications");
  const [formData, setFormData] = useState(defaultSettings);

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormData({
        notifications: {
          ...defaultSettings.notifications,
          ...(settings.notifications || {}),
        },
        loanSettings: {
          oneMonthLoan: {
            ...defaultSettings.loanSettings.oneMonthLoan,
            ...(settings.loanSettings?.oneMonthLoan || {}),
          },
          installmentLoan: {
            ...defaultSettings.loanSettings.installmentLoan,
            ...(settings.loanSettings?.installmentLoan || {}),
          },
          weeklyLoan: {
            ...defaultSettings.loanSettings.weeklyLoan,
            ...(settings.loanSettings?.weeklyLoan || {}),
          },
          dailyLoan: {
            ...defaultSettings.loanSettings.dailyLoan,
            ...(settings.loanSettings?.dailyLoan || {}),
          },
          latePaymentPenalty:
            settings.loanSettings?.latePaymentPenalty ??
            defaultSettings.loanSettings.latePaymentPenalty,
          defaultLoanPurpose:
            settings.loanSettings?.defaultLoanPurpose ??
            defaultSettings.loanSettings.defaultLoanPurpose,
        },
        creditScoreThresholds: {
          poor: {
            ...defaultSettings.creditScoreThresholds.poor,
            ...(settings.creditScoreThresholds?.poor || {}),
          },
          fair: {
            ...defaultSettings.creditScoreThresholds.fair,
            ...(settings.creditScoreThresholds?.fair || {}),
          },
          good: {
            ...defaultSettings.creditScoreThresholds.good,
            ...(settings.creditScoreThresholds?.good || {}),
          },
        },
      });
    }
  }, [settings]);

  const tabs = [
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "loan", label: "Loan Settings", icon: FiDollarSign },
    { id: "credit", label: "Credit Scores", icon: FiTrendingUp },
    { id: "business", label: "Business Info", icon: FiBriefcase },
    { id: "security", label: "Security", icon: FiShield },
    { id: "maintenance", label: "Maintenance", icon: FiTool },
  ];

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateNotificationSettings(formData.notifications));
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateLoanSettings(formData.loanSettings));
  };

  const handleCreditSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateCreditThresholds(formData.creditScoreThresholds));
  };

  const updateOneMonthLoan = (field, value) => {
    setFormData({
      ...formData,
      loanSettings: {
        ...formData.loanSettings,
        oneMonthLoan: {
          ...formData.loanSettings.oneMonthLoan,
          [field]: value,
        },
      },
    });
  };

  const updateInstallmentLoan = (field, value) => {
    setFormData({
      ...formData,
      loanSettings: {
        ...formData.loanSettings,
        installmentLoan: {
          ...formData.loanSettings.installmentLoan,
          [field]: value,
        },
      },
    });
  };

  const updateWeeklyLoan = (field, value) => {
    setFormData({
      ...formData,
      loanSettings: {
        ...formData.loanSettings,
        weeklyLoan: {
          ...formData.loanSettings.weeklyLoan,
          [field]: value,
        },
      },
    });
  };

  const updateDailyLoan = (field, value) => {
    setFormData({
      ...formData,
      loanSettings: {
        ...formData.loanSettings,
        dailyLoan: {
          ...formData.loanSettings.dailyLoan,
          [field]: value,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "notifications":
        return (
          <form onSubmit={handleNotificationSubmit} className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {/* ... existing notification checkboxes ... */}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {saving ? <LoadingSpinner size="small" /> : <FiSave />}
                  <span>Save Notification Settings</span>
                </button>
              </div>
            </div>
          </form>
        );

      case "loan":
        return (
          <form onSubmit={handleLoanSubmit} className="space-y-6">
            {/* One Month Loan Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiCreditCard className="mr-2" />
                One Month Loan Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (%)
                  </label>
                  <div className="relative">
                    <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      className="input-field pl-10"
                      value={
                        formData.loanSettings?.oneMonthLoan?.interestRate ?? 10
                      }
                      onChange={(e) =>
                        updateOneMonthLoan(
                          "interestRate",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term (days)
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      className="input-field pl-10"
                      value={
                        formData.loanSettings?.oneMonthLoan?.loanTermDays ?? 30
                      }
                      onChange={(e) =>
                        updateOneMonthLoan(
                          "loanTermDays",
                          parseInt(e.target.value) || 30,
                        )
                      }
                      min="1"
                      max="365"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Amount (KES)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={
                      formData.loanSettings?.oneMonthLoan?.minAmount ?? 100
                    }
                    onChange={(e) =>
                      updateOneMonthLoan(
                        "minAmount",
                        parseInt(e.target.value) || 100,
                      )
                    }
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Amount (KES)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={
                      formData.loanSettings?.oneMonthLoan?.maxAmount ?? 1000000
                    }
                    onChange={(e) =>
                      updateOneMonthLoan(
                        "maxAmount",
                        parseInt(e.target.value) || 1000000,
                      )
                    }
                    min="100"
                  />
                </div>
              </div>
            </div>

            {/* Installment Loan Settings (Monthly) */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiTrendingUp className="mr-2" />
                Monthly Installment Loan Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (%)
                  </label>
                  <div className="relative">
                    <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      className="input-field pl-10"
                      value={
                        formData.loanSettings?.installmentLoan?.interestRate ??
                        20
                      }
                      onChange={(e) =>
                        updateInstallmentLoan(
                          "interestRate",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Tenure (months)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={
                      formData.loanSettings?.installmentLoan?.minTenure ?? 2
                    }
                    onChange={(e) =>
                      updateInstallmentLoan(
                        "minTenure",
                        parseInt(e.target.value) || 2,
                      )
                    }
                    min="1"
                    max="12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Tenure (months)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={
                      formData.loanSettings?.installmentLoan?.maxTenure ?? 4
                    }
                    onChange={(e) =>
                      updateInstallmentLoan(
                        "maxTenure",
                        parseInt(e.target.value) || 4,
                      )
                    }
                    min="1"
                    max="12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Amount (KES)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={
                      formData.loanSettings?.installmentLoan?.minAmount ?? 1000
                    }
                    onChange={(e) =>
                      updateInstallmentLoan(
                        "minAmount",
                        parseInt(e.target.value) || 1000,
                      )
                    }
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Amount (KES)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={
                      formData.loanSettings?.installmentLoan?.maxAmount ??
                      1000000
                    }
                    onChange={(e) =>
                      updateInstallmentLoan(
                        "maxAmount",
                        parseInt(e.target.value) || 1000000,
                      )
                    }
                    min="100"
                  />
                </div>
              </div>
            </div>

            {/* Weekly Loan Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiClock className="mr-2" />
                Weekly Loan Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (%)
                  </label>
                  <div className="relative">
                    <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      className="input-field pl-10"
                      value={
                        formData.loanSettings?.weeklyLoan?.interestRate ?? 10
                      }
                      onChange={(e) =>
                        updateWeeklyLoan(
                          "interestRate",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Weeks
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.loanSettings?.weeklyLoan?.minWeeks ?? 2}
                    onChange={(e) =>
                      updateWeeklyLoan(
                        "minWeeks",
                        parseInt(e.target.value) || 2,
                      )
                    }
                    min="1"
                    max="12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Weeks
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.loanSettings?.weeklyLoan?.maxWeeks ?? 8}
                    onChange={(e) =>
                      updateWeeklyLoan(
                        "maxWeeks",
                        parseInt(e.target.value) || 8,
                      )
                    }
                    min="1"
                    max="12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Amount (KES)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.loanSettings?.weeklyLoan?.minAmount ?? 500}
                    onChange={(e) =>
                      updateWeeklyLoan(
                        "minAmount",
                        parseInt(e.target.value) || 500,
                      )
                    }
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Amount (KES)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={
                      formData.loanSettings?.weeklyLoan?.maxAmount ?? 500000
                    }
                    onChange={(e) =>
                      updateWeeklyLoan(
                        "maxAmount",
                        parseInt(e.target.value) || 500000,
                      )
                    }
                    min="100"
                  />
                </div>
              </div>
            </div>

            {/* Daily Loan Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiSun className="mr-2" />
                Daily Loan Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (%)
                  </label>
                  <div className="relative">
                    <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      className="input-field pl-10"
                      value={
                        formData.loanSettings?.dailyLoan?.interestRate ?? 5
                      }
                      onChange={(e) =>
                        updateDailyLoan(
                          "interestRate",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Days
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.loanSettings?.dailyLoan?.minDays ?? 3}
                    onChange={(e) =>
                      updateDailyLoan("minDays", parseInt(e.target.value) || 3)
                    }
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Days
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.loanSettings?.dailyLoan?.maxDays ?? 14}
                    onChange={(e) =>
                      updateDailyLoan("maxDays", parseInt(e.target.value) || 14)
                    }
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Amount (KES)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.loanSettings?.dailyLoan?.minAmount ?? 100}
                    onChange={(e) =>
                      updateDailyLoan(
                        "minAmount",
                        parseInt(e.target.value) || 100,
                      )
                    }
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Amount (KES)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={
                      formData.loanSettings?.dailyLoan?.maxAmount ?? 100000
                    }
                    onChange={(e) =>
                      updateDailyLoan(
                        "maxAmount",
                        parseInt(e.target.value) || 100000,
                      )
                    }
                    min="100"
                  />
                </div>
              </div>
            </div>

            {/* General Loan Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                General Loan Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Late Payment Penalty (%)
                  </label>
                  <div className="relative">
                    <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      className="input-field pl-10"
                      value={formData.loanSettings?.latePaymentPenalty ?? 5}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          loanSettings: {
                            ...formData.loanSettings,
                            latePaymentPenalty: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Loan Purpose
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={
                      formData.loanSettings?.defaultLoanPurpose ??
                      "Personal use"
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loanSettings: {
                          ...formData.loanSettings,
                          defaultLoanPurpose: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center space-x-2 px-6 py-3"
              >
                {saving ? <LoadingSpinner size="small" /> : <FiSave />}
                <span>Save All Loan Settings</span>
              </button>
            </div>
          </form>
        );

      // ... rest of the cases remain the same
      default:
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500">Select a settings category</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Settings</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">{renderContent()}</div>
      </div>

      {settings?.updatedAt && (
        <div className="text-sm text-gray-500 flex items-center space-x-2">
          <FiRefreshCw size={14} />
          <span>
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
