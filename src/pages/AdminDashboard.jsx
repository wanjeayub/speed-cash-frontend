import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

import {
  FiUsers,
  FiCreditCard,
  FiPieChart,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiDownload,
  FiEye,
  FiArrowUp,
  FiArrowDown,
  FiShield,
  FiUserPlus,
} from "react-icons/fi";
import { logout } from "../store/slices/authSlice";
import {
  getAllUsers,
  getUserDetails,
  getAllLoans,
  getLoanStats,
  approveLoan,
  rejectLoan,
  processPayment,
} from "../store/slices/adminSlice";

import adminService from "../services/admin.service";
import CreateAdminModal from "../components/CreateAdminModal";
import LoadingSpinner from "../components/LoadingSpinner";
import UserDetailsModal from "../components/UserDetailsModal";
import PaymentModal from "../components/PaymentModal";
import LoanStats from "../components/LoanStats";
// import CreditsScoreGauge from "../components/CreditsScoreGauge";
import AdminSettings from "../components/AdminSettings";
import InstallmentScheduleModal from "../components/InstallmentScheduleModal";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { users, loans, stats, selectedUser, loading, loanStats } = useSelector(
    (state) => state.admin,
  );

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInstallmentSchedule, setShowInstallmentSchedule] = useState(false);
  const [selectedInstallmentLoan, setSelectedInstallmentLoan] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    month: "",
    year: new Date().getFullYear(),
    search: "",
  });
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Define tabs array at the top, before any functions that use it
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: FiPieChart },
    { id: "users", label: "Users", icon: FiUsers },
    { id: "loans", label: "Loans", icon: FiCreditCard },
    { id: "pending", label: "Pending Loans", icon: FiClock },
    { id: "approved", label: "Approved Loans", icon: FiCheckCircle },
    { id: "partial", label: "Partial Loans", icon: FiTrendingUp },
    { id: "paid", label: "Paid Loans", icon: FiDollarSign },
    { id: "defaulted", label: "Defaulted", icon: FiAlertCircle },
    { id: "admins", label: "Admin Management", icon: FiShield },
    { id: "stats", label: "Statistics", icon: FiTrendingUp },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  useEffect(() => {
    loadDashboardData();
  }, [dispatch, filters.year]);

  const loadDashboardData = async () => {
    await dispatch(getAllUsers());
    await dispatch(getAllLoans(filters));
    await dispatch(getLoanStats(filters.year));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleApproveLoan = async (loanId) => {
    await dispatch(approveLoan({ loanId, notes: "Approved by admin" }));
    loadDashboardData();
  };

  const handleRejectLoan = async (loanId) => {
    const reason = prompt("Please enter rejection reason:");
    if (reason) {
      await dispatch(rejectLoan({ loanId, reason }));
      loadDashboardData();
    }
  };

  const handleProcessPayment = async (loanId, paymentData) => {
    await dispatch(processPayment({ loanId, ...paymentData }));
    setShowPaymentModal(false);
    loadDashboardData();
  };

  const handleViewUser = async (userId) => {
    await dispatch(getUserDetails(userId));
    setShowUserModal(true);
  };

  const handleExport = async (type, data) => {
    try {
      let exportData;
      let filename;
      let headers;

      switch (type) {
        case "users":
          exportData = users;
          filename = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
          headers = [
            "Name",
            "Email",
            "ID Number",
            "Phone",
            "Status",
            "Joined Date",
          ];
          break;
        case "loans":
          exportData = loans;
          filename = `loans-export-${new Date().toISOString().split("T")[0]}.csv`;
          headers = [
            "Loan Number",
            "Borrower",
            "Amount",
            "Status",
            "Applied Date",
            "Due Date",
          ];
          break;
        case "stats":
          exportData = loanStats?.monthly || [];
          filename = `loan-stats-${new Date().toISOString().split("T")[0]}.csv`;
          headers = ["Month", "Loan Count", "Total Amount", "Interest"];
          break;
        default:
          return;
      }

      // Convert to CSV
      const csvContent = [
        headers.join(","),
        ...exportData.map((item) => {
          if (type === "users") {
            return [
              `"${item.firstName} ${item.lastName}"`,
              item.email,
              item.idNumber,
              item.phoneNumbers?.[0]?.number || "",
              item.isProfileComplete ? "Complete" : "Incomplete",
              new Date(item.createdAt).toLocaleDateString(),
            ].join(",");
          } else if (type === "loans") {
            return [
              item.loanNumber,
              `"${item.user?.firstName} ${item.user?.lastName}"`,
              item.amount,
              item.status,
              new Date(item.applicationDate).toLocaleDateString(),
              item.dueDate
                ? new Date(item.dueDate).toLocaleDateString()
                : "N/A",
            ].join(",");
          } else if (type === "stats") {
            return [
              item.month || `Month ${item._id}`,
              item.count || item.totalLoans || 0,
              item.amount || item.totalAmount || 0,
              item.interest || item.totalInterest || 0,
            ].join(",");
          }
          return "";
        }),
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${type} exported successfully`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const getLoansByStatus = (status) => {
    return loans?.filter((loan) => loan.status === status) || [];
  };

  const pendingLoans = getLoansByStatus("pending");
  const approvedLoans = getLoansByStatus("approved");
  const partialLoans = getLoansByStatus("partial");
  const paidLoans = getLoansByStatus("paid");
  const defaultedLoans = getLoansByStatus("defaulted");

  // Responsive table rendering with card view for mobile
  const renderLoansTable = (loansList, showActions = true) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loan #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrower
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {showActions && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loansList.map((loan) => {
              const remainingBalance =
                loan.totalAmount - (loan.amountPaid || 0);
              const canProcessPayment = ["approved", "partial"].includes(
                loan.status,
              );
              const isInstallment = loan.productType === "installment";
              const paidInstallments =
                loan.repaymentSchedule?.filter((i) => i.status === "paid")
                  .length || 0;
              const totalInstallments = loan.tenureMonths || 1;

              return (
                <tr key={loan._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {loan.loanNumber}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {loan.user?.firstName} {loan.user?.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {loan.user?.email}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isInstallment
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {isInstallment ? "Installment" : "One Month"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    KES {loan.amount?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">
                    KES {loan.amountPaid?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-orange-600">
                    KES {remainingBalance.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {isInstallment ? (
                      <div>
                        <div>
                          Next:{" "}
                          {loan.repaymentSchedule?.find(
                            (i) => i.status === "pending",
                          )?.dueDate
                            ? new Date(
                                loan.repaymentSchedule.find(
                                  (i) => i.status === "pending",
                                ).dueDate,
                              ).toLocaleDateString()
                            : "Completed"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {paidInstallments}/{totalInstallments}
                        </div>
                      </div>
                    ) : loan.dueDate ? (
                      new Date(loan.dueDate).toLocaleDateString()
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        loan.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : loan.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : loan.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : loan.status === "paid"
                                ? "bg-blue-100 text-blue-800"
                                : loan.status === "partial"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  {showActions && (
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-1">
                        {loan.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApproveLoan(loan._id)}
                              className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectLoan(loan._id)}
                              className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {canProcessPayment && (
                          <button
                            onClick={() => {
                              setSelectedLoan(loan);
                              setShowPaymentModal(true);
                            }}
                            className="text-primary-600 hover:text-primary-900 text-xs bg-primary-50 px-2 py-1 rounded"
                          >
                            Payment
                          </button>
                        )}
                        {isInstallment && loan.repaymentSchedule && (
                          <button
                            onClick={() => {
                              setSelectedInstallmentLoan(loan);
                              setShowInstallmentSchedule(true);
                            }}
                            className="text-purple-600 hover:text-purple-900 text-xs bg-purple-50 px-2 py-1 rounded"
                          >
                            Schedule
                          </button>
                        )}
                        <button
                          onClick={() => handleViewUser(loan.user?._id)}
                          className="text-gray-600 hover:text-gray-900 text-xs bg-gray-50 px-2 py-1 rounded"
                        >
                          View User
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {loansList.map((loan) => {
          const remainingBalance = loan.totalAmount - (loan.amountPaid || 0);
          const isInstallment = loan.productType === "installment";
          const paidInstallments =
            loan.repaymentSchedule?.filter((i) => i.status === "paid").length ||
            0;
          const totalInstallments = loan.tenureMonths || 1;

          return (
            <div key={loan._id} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-sm">
                    {loan.loanNumber}
                  </span>
                  <div className="text-sm font-medium mt-1">
                    {loan.user?.firstName} {loan.user?.lastName}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    loan.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : loan.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : loan.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : loan.status === "paid"
                            ? "bg-blue-100 text-blue-800"
                            : loan.status === "partial"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {loan.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs">Type:</span>
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        isInstallment
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {isInstallment ? "Installment" : "One Month"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Amount:</span>
                  <div className="font-medium">
                    KES {loan.amount?.toLocaleString() || 0}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Paid:</span>
                  <div className="text-green-600">
                    KES {loan.amountPaid?.toLocaleString() || 0}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Balance:</span>
                  <div className="text-orange-600">
                    KES {remainingBalance.toLocaleString()}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 text-xs">Due Date:</span>
                  <div>
                    {isInstallment ? (
                      <>
                        Next:{" "}
                        {loan.repaymentSchedule?.find(
                          (i) => i.status === "pending",
                        )?.dueDate
                          ? new Date(
                              loan.repaymentSchedule.find(
                                (i) => i.status === "pending",
                              ).dueDate,
                            ).toLocaleDateString()
                          : "Completed"}
                        <span className="text-xs text-gray-500 ml-2">
                          ({paidInstallments}/{totalInstallments})
                        </span>
                      </>
                    ) : loan.dueDate ? (
                      new Date(loan.dueDate).toLocaleDateString()
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              </div>

              {showActions && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {loan.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApproveLoan(loan._id)}
                        className="flex-1 text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-2 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectLoan(loan._id)}
                        className="flex-1 text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-2 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {["approved", "partial"].includes(loan.status) && (
                    <button
                      onClick={() => {
                        setSelectedLoan(loan);
                        setShowPaymentModal(true);
                      }}
                      className="flex-1 text-primary-600 hover:text-primary-900 text-xs bg-primary-50 px-2 py-2 rounded"
                    >
                      Process Payment
                    </button>
                  )}
                  {isInstallment && loan.repaymentSchedule && (
                    <button
                      onClick={() => {
                        setSelectedInstallmentLoan(loan);
                        setShowInstallmentSchedule(true);
                      }}
                      className="flex-1 text-purple-600 hover:text-purple-900 text-xs bg-purple-50 px-2 py-2 rounded"
                    >
                      View Schedule
                    </button>
                  )}
                  <button
                    onClick={() => handleViewUser(loan.user?._id)}
                    className="flex-1 text-gray-600 hover:text-gray-900 text-xs bg-gray-50 px-2 py-2 rounded"
                  >
                    View User
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Define renderDashboard function
  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Total Users</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">
                {users?.length || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
              <FiUsers className="text-blue-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Total Loans</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">
                {loans?.length || 0}
              </p>
            </div>
            <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
              <FiCreditCard className="text-green-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Total Amount</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">
                KES{" "}
                {loans
                  ?.reduce((sum, loan) => sum + loan.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
              <FiDollarSign className="text-purple-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">
                Pending Approvals
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">
                {pendingLoans.length}
              </p>
            </div>
            <div className="bg-yellow-100 p-2 sm:p-3 rounded-lg">
              <FiClock className="text-yellow-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts - Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            Loan Distribution
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                By Status
              </h4>
              <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Pending",
                          value: pendingLoans.length,
                          color: "#FBBF24",
                        },
                        {
                          name: "Approved",
                          value: approvedLoans.length,
                          color: "#34D399",
                        },
                        {
                          name: "Partial",
                          value: partialLoans.length,
                          color: "#60A5FA",
                        },
                        {
                          name: "Paid",
                          value: paidLoans.length,
                          color: "#10B981",
                        },
                        {
                          name: "Defaulted",
                          value: defaultedLoans.length,
                          color: "#EF4444",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                    >
                      {[
                        { color: "#FBBF24" },
                        { color: "#34D399" },
                        { color: "#60A5FA" },
                        { color: "#10B981" },
                        { color: "#EF4444" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                By Loan Type
              </h4>
              <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "One Month",
                          value:
                            loans?.filter((l) => l.productType === "one_month")
                              .length || 0,
                          color: "#3B82F6",
                        },
                        {
                          name: "Installment",
                          value:
                            loans?.filter(
                              (l) => l.productType === "installment",
                            ).length || 0,
                          color: "#8B5CF6",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                    >
                      <Cell fill="#3B82F6" />
                      <Cell fill="#8B5CF6" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            Monthly Loan Trends
          </h3>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.monthly || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="totalAmount"
                  stroke="#3B82F6"
                  name="Amount"
                />
                <Line
                  type="monotone"
                  dataKey="totalLoans"
                  stroke="#10B981"
                  name="Loans"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Loans - Responsive */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <h3 className="text-base sm:text-lg font-semibold">
            Recent Loan Applications
          </h3>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Loan #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Borrower
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans?.slice(0, 5).map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {loan.loanNumber}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {loan.user?.firstName} {loan.user?.lastName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        loan.productType === "installment"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {loan.productType === "installment"
                        ? "Installment"
                        : "One Month"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    KES {loan.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        loan.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : loan.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : loan.status === "paid"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {new Date(loan.applicationDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewUser(loan.user?._id)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-3">
          {loans?.slice(0, 5).map((loan) => (
            <div key={loan._id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-sm">{loan.loanNumber}</span>
                  <div className="text-sm mt-1">
                    {loan.user?.firstName} {loan.user?.lastName}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    loan.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : loan.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {loan.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs">Type:</span>
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        loan.productType === "installment"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {loan.productType === "installment"
                        ? "Installment"
                        : "One Month"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Amount:</span>
                  <div className="font-medium">
                    KES {loan.amount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Date:</span>
                  <div>
                    {new Date(loan.applicationDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t flex justify-end">
                <button
                  onClick={() => handleViewUser(loan.user?._id)}
                  className="text-primary-600 hover:text-primary-900 text-sm flex items-center"
                >
                  <FiEye className="mr-1" /> View User
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Define renderUsers function with responsive design
  const renderUsers = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
          <button
            onClick={() => handleExport("users")}
            className="flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
          >
            <FiDownload size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Desktop Users Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Credit Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Loans
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users
                ?.filter(
                  (user) =>
                    user.firstName
                      ?.toLowerCase()
                      .includes(filters.search.toLowerCase()) ||
                    user.lastName
                      ?.toLowerCase()
                      .includes(filters.search.toLowerCase()) ||
                    user.email
                      ?.toLowerCase()
                      .includes(filters.search.toLowerCase()) ||
                    user.idNumber?.includes(filters.search),
                )
                .map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                          {user.profilePhoto?.url ? (
                            <img
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                              src={user.profilePhoto.url}
                              alt=""
                            />
                          ) : (
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <FiUser className="text-gray-500 text-sm" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {user.phoneNumbers?.[0]?.number}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.idNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              user.creditScore >= 70
                                ? "bg-green-500"
                                : user.creditScore >= 40
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${user.creditScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{user.creditScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.stats?.totalLoans || 0}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isProfileComplete
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.isProfileComplete ? "Complete" : "Incomplete"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewUser(user._id)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Users Cards */}
      <div className="md:hidden space-y-3">
        {users
          ?.filter(
            (user) =>
              user.firstName
                ?.toLowerCase()
                .includes(filters.search.toLowerCase()) ||
              user.lastName
                ?.toLowerCase()
                .includes(filters.search.toLowerCase()) ||
              user.email
                ?.toLowerCase()
                .includes(filters.search.toLowerCase()) ||
              user.idNumber?.includes(filters.search),
          )
          .map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 h-10 w-10">
                  {user.profilePhoto?.url ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.profilePhoto.url}
                      alt=""
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiUser className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isProfileComplete
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user.isProfileComplete ? "Complete" : "Incomplete"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 text-xs">Phone:</span>
                  <div>{user.phoneNumbers?.[0]?.number || "N/A"}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">ID Number:</span>
                  <div>{user.idNumber}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Credit Score:</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${
                          user.creditScore >= 70
                            ? "bg-green-500"
                            : user.creditScore >= 40
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${user.creditScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{user.creditScore}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Total Loans:</span>
                  <div>{user.stats?.totalLoans || 0}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t flex justify-end">
                <button
                  onClick={() => handleViewUser(user._id)}
                  className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // Admin Management Component with responsive design
  const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
      fetchAdmins();
      fetchUsers();
    }, []);

    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await adminService.getAllAdmins();
        setAdmins(response.admins);
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins");
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await adminService.getAllUsers();
        setUsers(response.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const handlePromoteToAdmin = async (userId) => {
      if (
        !window.confirm("Are you sure you want to promote this user to admin?")
      )
        return;

      try {
        await adminService.promoteToAdmin(userId);
        toast.success("User promoted to admin successfully");
        fetchAdmins();
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to promote user");
      }
    };

    const handleDemoteFromAdmin = async (adminId) => {
      if (!window.confirm("Are you sure you want to demote this admin?"))
        return;

      try {
        await adminService.demoteFromAdmin(adminId);
        toast.success("Admin demoted successfully");
        fetchAdmins();
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to demote admin");
      }
    };

    const nonAdminUsers = users.filter(
      (u) => u.role !== "admin" && u.role !== "superadmin",
    );

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold">Admin Management</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center justify-center space-x-2 px-4 py-2 text-sm"
          >
            <FiUserPlus />
            <span>Create New Admin</span>
          </button>
        </div>

        {/* Current Admins - Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Current Administrators</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Admin
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <FiShield className="text-primary-600 text-sm" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium">
                            {admin.firstName} {admin.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {admin.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {admin.idNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {admin.email !== "admin@speed-cash.com" && (
                        <button
                          onClick={() => handleDemoteFromAdmin(admin._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Demote
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current Admins - Mobile Cards */}
        <div className="md:hidden space-y-3">
          <h3 className="text-lg font-semibold px-1">Current Administrators</h3>
          {admins.map((admin) => (
            <div key={admin._id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiShield className="text-primary-600" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium">
                    {admin.firstName} {admin.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{admin.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs">ID Number:</span>
                  <div>{admin.idNumber}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Created:</span>
                  <div>{new Date(admin.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              {admin.email !== "admin@speed-cash.com" && (
                <div className="mt-3 pt-3 border-t">
                  <button
                    onClick={() => handleDemoteFromAdmin(admin._id)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Demote to User
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Promote Users Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Promote Users to Admin</h3>
            <div className="mt-3 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Loans
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {nonAdminUsers
                  .filter(
                    (user) =>
                      user.firstName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.lastName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.idNumber?.includes(searchTerm),
                  )
                  .map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            {user.profilePhoto?.url ? (
                              <img
                                className="h-8 w-8 rounded-full object-cover"
                                src={user.profilePhoto.url}
                                alt=""
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <FiUser className="text-gray-500 text-sm" />
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {user.idNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {user.stats?.totalLoans || 0}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handlePromoteToAdmin(user._id)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Promote
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-3">
            {nonAdminUsers
              .filter(
                (user) =>
                  user.firstName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  user.lastName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  user.email
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  user.idNumber?.includes(searchTerm),
              )
              .map((user) => (
                <div key={user._id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 h-8 w-8">
                      {user.profilePhoto?.url ? (
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={user.profilePhoto.url}
                          alt=""
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <FiUser className="text-gray-500 text-sm" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-sm">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <span className="text-gray-500">ID:</span> {user.idNumber}
                    </div>
                    <div>
                      <span className="text-gray-500">Loans:</span>{" "}
                      {user.stats?.totalLoans || 0}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePromoteToAdmin(user._id)}
                    className="w-full text-primary-600 hover:text-primary-900 text-sm border border-primary-200 rounded py-1"
                  >
                    Promote to Admin
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Create Admin Modal */}
        {showCreateModal && (
          <CreateAdminModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchAdmins();
            }}
          />
        )}
      </div>
    );
  };

  // Define renderTabContent function that uses all the above functions
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "users":
        return renderUsers();
      case "loans":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold">All Loans</h2>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="flex-1 sm:flex-none input-field text-sm px-3 py-2 border rounded-lg"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="defaulted">Defaulted</option>
                  </select>
                  <input
                    type="month"
                    className="flex-1 sm:flex-none input-field text-sm px-3 py-2 border rounded-lg"
                    onChange={(e) => {
                      const [year, month] = e.target.value.split("-");
                      setFilters({ ...filters, year, month });
                    }}
                  />
                  <button
                    onClick={() => handleExport("loans")}
                    className="flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <FiDownload size={16} />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
            {renderLoansTable(loans || [])}
          </div>
        );
      case "pending":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold">
              Pending Loans ({pendingLoans.length})
            </h2>
            {renderLoansTable(pendingLoans)}
          </div>
        );
      case "approved":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold">
              Approved Loans ({approvedLoans.length})
            </h2>
            {renderLoansTable(approvedLoans)}
          </div>
        );
      case "partial":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold">
              Partial Loans ({partialLoans.length})
            </h2>
            {renderLoansTable(partialLoans)}
          </div>
        );
      case "paid":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold">
              Paid Loans ({paidLoans.length})
            </h2>
            {renderLoansTable(paidLoans)}
          </div>
        );
      case "defaulted":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold">
              Defaulted Loans ({defaultedLoans.length})
            </h2>
            {renderLoansTable(defaultedLoans)}
          </div>
        );
      case "admins":
        return <AdminManagement />;
      case "stats":
        return (
          <LoanStats
            stats={loanStats}
            onYearChange={(year) => setFilters({ ...filters, year })}
          />
        );
      case "settings":
        return (
          <div className="max-w-4xl mx-auto px-4">
            <AdminSettings />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Speedy Cash Solutions</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-20 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 mr-3"
            >
              <FiMenu size={24} />
            </button>
            <span className="text-xl font-bold text-primary-600">
              SpeedyCash
            </span>
          </div>
          <div className="flex items-center">
            {user?.profilePhoto?.url ? (
              <img
                src={user.profilePhoto.url}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="text-primary-600" size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Desktop (fixed) and Mobile (slide-over) */}
        <div
          className={`
            fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-transform duration-300
            ${sidebarOpen && !mobileMenuOpen ? "hidden md:block md:w-64" : ""}
            ${mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
            md:translate-x-0 md:w-64
          `}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <div>
              <span className="text-xl font-bold text-primary-600">
                SpeedyCash
              </span>
              <span className="block text-xs text-gray-500">Admin</span>
            </div>
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileMenuOpen(false);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              {window.innerWidth < 768 ? (
                <FiX size={20} />
              ) : sidebarOpen ? (
                <FiX size={20} />
              ) : (
                <FiMenu size={20} />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 overflow-y-auto h-[calc(100%-8rem)]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (window.innerWidth < 768) {
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={`w-full flex items-center px-3 py-3 mb-1 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="ml-3 text-sm font-medium truncate">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Admin Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <div className="flex items-center">
              {user?.profilePhoto?.url ? (
                <img
                  src={user.profilePhoto.url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiUser className="text-primary-600" size={16} />
                </div>
              )}
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex items-center text-gray-600 hover:text-red-600 w-full px-2 py-2 rounded-lg hover:bg-gray-50"
            >
              <FiLogOut size={20} />
              <span className="ml-3 text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:ml-64 pt-16 md:pt-0 min-h-screen">
          <div className="p-4 sm:p-6 md:p-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setShowUserModal(false)}
          onViewLoan={(loan) => {
            setShowUserModal(false);
            setSelectedLoan(loan);
            setShowPaymentModal(true);
          }}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedLoan && (
        <PaymentModal
          loan={selectedLoan}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedLoan(null);
          }}
          onSubmit={handleProcessPayment}
        />
      )}

      {/* Installment Schedule Modal */}
      {showInstallmentSchedule && selectedInstallmentLoan && (
        <InstallmentScheduleModal
          loan={selectedInstallmentLoan}
          onClose={() => {
            setShowInstallmentSchedule(false);
            setSelectedInstallmentLoan(null);
          }}
        />
      )}
    </>
  );
};

export default AdminDashboard;
