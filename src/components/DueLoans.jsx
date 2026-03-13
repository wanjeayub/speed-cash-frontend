import React, { useState, useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiMail,
  FiDownload,
  FiEye,
  FiSun,
  FiTrendingUp,
} from "react-icons/fi";
import adminService from "../services/admin.service";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";
import { formatCurrency, formatDate } from "../utils/formatters";

const DueLoans = () => {
  const [loading, setLoading] = useState(true);
  const [dueToday, setDueToday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    todayAmount: 0,
    upcomingCount: 0,
    upcomingAmount: 0,
    overdueCount: 0,
    overdueAmount: 0,
  });
  const [sendingNotification, setSendingNotification] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  useEffect(() => {
    loadDueLoans();
  }, []);

  const loadDueLoans = async () => {
    setLoading(true);
    try {
      const [todayRes, upcomingRes, overdueRes] = await Promise.all([
        adminService.getDueLoansToday(),
        adminService.getUpcomingDueLoans(),
        adminService.getOverdueLoans(),
      ]);

      setDueToday(todayRes.loans || []);
      setUpcoming(upcomingRes.loans || []);
      setOverdue(overdueRes.loans || []);

      // Calculate stats
      const todayAmount = (todayRes.loans || []).reduce(
        (sum, loan) => sum + loan.totalAmount,
        0,
      );
      const upcomingAmount = (upcomingRes.loans || []).reduce(
        (sum, loan) => sum + loan.totalAmount,
        0,
      );
      const overdueAmount = (overdueRes.loans || []).reduce(
        (sum, loan) => sum + loan.totalAmount,
        0,
      );

      setStats({
        todayCount: todayRes.count || 0,
        todayAmount,
        upcomingCount: upcomingRes.count || 0,
        upcomingAmount,
        overdueCount: overdueRes.count || 0,
        overdueAmount,
      });
    } catch (error) {
      console.error("Error loading due loans:", error);
      toast.error("Failed to load due loans");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!window.confirm("Send daily due loans notification email?")) return;

    setSendingNotification(true);
    try {
      await adminService.sendDueLoansNotification();
      toast.success("Notification sent successfully!");
    } catch (error) {
      toast.error("Failed to send notification");
    } finally {
      setSendingNotification(false);
    }
  };

  const handleExport = () => {
    try {
      const data =
        activeTab === "today"
          ? dueToday
          : activeTab === "upcoming"
            ? upcoming
            : overdue;

      const csvContent = [
        [
          "Loan Number",
          "Borrower",
          "Phone",
          "Amount",
          "Interest Rate",
          "Due Date",
          "Type",
        ].join(","),
        ...data.map((loan) =>
          [
            loan.loanNumber,
            `"${loan.user?.firstName} ${loan.user?.lastName}"`,
            loan.user?.phoneNumbers?.[0]?.number || "N/A",
            loan.totalAmount,
            `${loan.interestRate}%`,
            new Date(loan.dueDate).toLocaleDateString(),
            loan.productType,
          ].join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${activeTab}-loans-${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const getProductTypeInfo = (type) => {
    switch (type) {
      case "one_month":
        return { bg: "bg-blue-100", text: "text-blue-800", label: "One Month" };
      case "twenty_four_hr":
        return { bg: "bg-orange-100", text: "text-orange-800", label: "24hr" };
      case "installment":
        return {
          bg: "bg-purple-100",
          text: "text-purple-800",
          label: "Monthly",
        };
      case "weekly":
        return { bg: "bg-green-100", text: "text-green-800", label: "Weekly" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", label: type };
    }
  };

  const renderLoanCard = (loan) => {
    const typeInfo = getProductTypeInfo(loan.productType);
    const isOverdue = activeTab === "overdue";

    return (
      <div
        key={loan._id}
        className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-medium text-gray-900">#{loan.loanNumber}</p>
            <p className="text-sm text-gray-600">
              {loan.user?.firstName} {loan.user?.lastName}
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.text}`}
          >
            {typeInfo.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500">Amount Due</p>
            <p className="font-semibold text-lg text-primary-600">
              {formatCurrency(loan.totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm font-medium">
              {loan.user?.phoneNumbers?.[0]?.number || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t">
          <div className="flex items-center text-sm">
            <FiCalendar className="mr-1 text-gray-400" size={14} />
            <span
              className={
                isOverdue ? "text-red-600 font-medium" : "text-gray-600"
              }
            >
              Due: {formatDate(loan.dueDate)}
            </span>
          </div>
          <button
            onClick={() =>
              window.open(`/admin/loans?loan=${loan._id}`, "_blank")
            }
            className="text-primary-600 hover:text-primary-800"
          >
            <FiEye size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderLoansList = (loans) => {
    if (loans.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiCheckCircle className="mx-auto text-4xl text-green-500 mb-3" />
          <p className="text-gray-600">No loans in this category</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loans.map(renderLoanCard)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Due Loans Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleSendNotification}
            disabled={sendingNotification}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <FiMail size={18} />
            <span>
              {sendingNotification ? "Sending..." : "Send Daily Report"}
            </span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <FiDownload size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <FiSun className="text-yellow-600 text-2xl" />
            <span className="text-3xl font-bold text-yellow-700">
              {stats.todayCount}
            </span>
          </div>
          <p className="text-sm text-yellow-800 font-medium">Due Today</p>
          <p className="text-lg font-semibold text-yellow-900 mt-1">
            {formatCurrency(stats.todayAmount)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <FiCalendar className="text-blue-600 text-2xl" />
            <span className="text-3xl font-bold text-blue-700">
              {stats.upcomingCount}
            </span>
          </div>
          <p className="text-sm text-blue-800 font-medium">Upcoming (7 days)</p>
          <p className="text-lg font-semibold text-blue-900 mt-1">
            {formatCurrency(stats.upcomingAmount)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <FiAlertCircle className="text-red-600 text-2xl" />
            <span className="text-3xl font-bold text-red-700">
              {stats.overdueCount}
            </span>
          </div>
          <p className="text-sm text-red-800 font-medium">Overdue</p>
          <p className="text-lg font-semibold text-red-900 mt-1">
            {formatCurrency(stats.overdueAmount)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("today")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "today"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Due Today ({stats.todayCount})
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "upcoming"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming ({stats.upcomingCount})
          </button>
          <button
            onClick={() => setActiveTab("overdue")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overdue"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Overdue ({stats.overdueCount})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "today" && renderLoansList(dueToday)}
        {activeTab === "upcoming" && renderLoansList(upcoming)}
        {activeTab === "overdue" && renderLoansList(overdue)}
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <FiAlertCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Loans become due at midnight on their due
            date. Overdue loans are automatically marked as defaulted after 30
            days. Daily email notifications are sent at 8:00 AM.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DueLoans;
