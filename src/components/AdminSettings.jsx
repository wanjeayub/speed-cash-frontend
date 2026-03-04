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
} from "react-icons/fi";
import {
  getSettings,
  updateNotificationSettings,
  updateLoanSettings,
  updateCreditThresholds,
} from "../store/slices/adminSettingSlice";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const dispatch = useDispatch();
  const { settings, loading, saving } = useSelector(
    (state) => state.adminSettings,
  );
  const [activeTab, setActiveTab] = useState("notifications");
  const [formData, setFormData] = useState({
    notifications: {
      emailNewLoan: true,
      emailPaymentReceived: true,
      smsUrgent: false,
    },
    loanSettings: {
      defaultInterestRate: 10,
      defaultLoanTermDays: 30,
      minLoanAmount: 100,
      maxLoanAmount: 1000000,
      latePaymentPenalty: 5,
    },
    creditScoreThresholds: {
      poor: { min: 0, max: 39, color: "#EF4444" },
      fair: { min: 40, max: 69, color: "#FBBF24" },
      good: { min: 70, max: 100, color: "#10B981" },
    },
  });

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormData({
        notifications: settings.notifications || formData.notifications,
        loanSettings: settings.loanSettings || formData.loanSettings,
        creditScoreThresholds:
          settings.creditScoreThresholds || formData.creditScoreThresholds,
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
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Email - New Loan Applications</p>
                    <p className="text-sm text-gray-500">
                      Receive email when users apply for loans
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-checkbox"
                    checked={formData.notifications.emailNewLoan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          emailNewLoan: e.target.checked,
                        },
                      })
                    }
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Email - Payment Received</p>
                    <p className="text-sm text-gray-500">
                      Receive email when payments are processed
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-checkbox"
                    checked={formData.notifications.emailPaymentReceived}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          emailPaymentReceived: e.target.checked,
                        },
                      })
                    }
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">SMS - Urgent Matters</p>
                    <p className="text-sm text-gray-500">
                      Receive SMS for urgent notifications
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-checkbox"
                    checked={formData.notifications.smsUrgent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          smsUrgent: e.target.checked,
                        },
                      })
                    }
                  />
                </label>
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
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Loan Settings</h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.loanSettings.defaultInterestRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loanSettings: {
                          ...formData.loanSettings,
                          defaultInterestRate: parseFloat(e.target.value),
                        },
                      })
                    }
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Loan Term (days)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.loanSettings.defaultLoanTermDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loanSettings: {
                          ...formData.loanSettings,
                          defaultLoanTermDays: parseInt(e.target.value),
                        },
                      })
                    }
                    min="1"
                    max="365"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Loan Amount (KES)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.loanSettings.minLoanAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loanSettings: {
                          ...formData.loanSettings,
                          minLoanAmount: parseInt(e.target.value),
                        },
                      })
                    }
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Loan Amount (KES)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.loanSettings.maxLoanAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loanSettings: {
                          ...formData.loanSettings,
                          maxLoanAmount: parseInt(e.target.value),
                        },
                      })
                    }
                    min="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Late Payment Penalty (%)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.loanSettings.latePaymentPenalty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loanSettings: {
                          ...formData.loanSettings,
                          latePaymentPenalty: parseFloat(e.target.value),
                        },
                      })
                    }
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {saving ? <LoadingSpinner size="small" /> : <FiSave />}
                  <span>Save Loan Settings</span>
                </button>
              </div>
            </div>
          </form>
        );

      case "credit":
        return (
          <form onSubmit={handleCreditSubmit} className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Credit Score Thresholds
              </h3>

              <div className="space-y-6">
                {/* Poor Credit */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Poor Credit</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Min Score
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={formData.creditScoreThresholds.poor.min}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            creditScoreThresholds: {
                              ...formData.creditScoreThresholds,
                              poor: {
                                ...formData.creditScoreThresholds.poor,
                                min: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Max Score
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={formData.creditScoreThresholds.poor.max}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            creditScoreThresholds: {
                              ...formData.creditScoreThresholds,
                              poor: {
                                ...formData.creditScoreThresholds.poor,
                                max: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        className="w-full h-10 rounded border"
                        value={formData.creditScoreThresholds.poor.color}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            creditScoreThresholds: {
                              ...formData.creditScoreThresholds,
                              poor: {
                                ...formData.creditScoreThresholds.poor,
                                color: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Fair Credit */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Fair Credit</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Min Score
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={formData.creditScoreThresholds.fair.min}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            creditScoreThresholds: {
                              ...formData.creditScoreThresholds,
                              fair: {
                                ...formData.creditScoreThresholds.fair,
                                min: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Max Score
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={formData.creditScoreThresholds.fair.max}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            creditScoreThresholds: {
                              ...formData.creditScoreThresholds,
                              fair: {
                                ...formData.creditScoreThresholds.fair,
                                max: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        className="w-full h-10 rounded border"
                        value={formData.creditScoreThresholds.fair.color}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            creditScoreThresholds: {
                              ...formData.creditScoreThresholds,
                              fair: {
                                ...formData.creditScoreThresholds.fair,
                                color: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Good Credit */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Good Credit</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Min Score
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={formData.creditScoreThresholds.good.min}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            creditScoreThresholds: {
                              ...formData.creditScoreThresholds,
                              good: {
                                ...formData.creditScoreThresholds.good,
                                min: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Max Score
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={formData.creditScoreThresholds.good.max}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            creditScoreThresholds: {
                              ...formData.creditScoreThresholds,
                              good: {
                                ...formData.creditScoreThresholds.good,
                                max: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        className="w-full h-10 rounded border"
                        value={formData.creditScoreThresholds.good.color}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            creditScoreThresholds: {
                              ...formData.creditScoreThresholds,
                              good: {
                                ...formData.creditScoreThresholds.good,
                                color: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {saving ? <LoadingSpinner size="small" /> : <FiSave />}
                  <span>Save Credit Thresholds</span>
                </button>
              </div>
            </div>
          </form>
        );

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

      {/* Settings Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
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

      {/* Last Updated Info */}
      {settings?.updatedAt && (
        <div className="text-sm text-gray-500 flex items-center space-x-2">
          <FiRefreshCw size={14} />
          <span>
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
          </span>
          {settings.updatedBy && <span>by {settings.updatedBy}</span>}
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
