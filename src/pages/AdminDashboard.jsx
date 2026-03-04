import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";

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
import CreditScoreGauge from "../components/CreditsScoreGauge";
import AdminSettings from "../components/AdminSettings";
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
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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

  const getLoansByStatus = (status) => {
    return loans?.filter((loan) => loan.status === status) || [];
  };

  const pendingLoans = getLoansByStatus("pending");
  const approvedLoans = getLoansByStatus("approved");
  const partialLoans = getLoansByStatus("partial");
  const paidLoans = getLoansByStatus("paid");
  const defaultedLoans = getLoansByStatus("defaulted");

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-3xl font-bold mt-1">{users?.length || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <FiArrowUp className="mr-1" />
            <span>12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Loans</p>
              <p className="text-3xl font-bold mt-1">{loans?.length || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCreditCard className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <FiArrowUp className="mr-1" />
            <span>8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Amount</p>
              <p className="text-3xl font-bold mt-1">
                KES{" "}
                {loans
                  ?.reduce((sum, loan) => sum + loan.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiDollarSign className="text-purple-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <FiArrowUp className="mr-1" />
            <span>15% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Approvals</p>
              <p className="text-3xl font-bold mt-1">{pendingLoans.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiClock className="text-yellow-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-yellow-600">
            <FiAlertCircle className="mr-1" />
            <span>Requires attention</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Loan Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
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
                  { name: "Paid", value: paidLoans.length, color: "#10B981" },
                  {
                    name: "Defaulted",
                    value: defaultedLoans.length,
                    color: "#EF4444",
                  },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: "Pending", color: "#FBBF24" },
                  { name: "Approved", color: "#34D399" },
                  { name: "Partial", color: "#60A5FA" },
                  { name: "Paid", color: "#10B981" },
                  { name: "Defaulted", color: "#EF4444" },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Loan Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Loan Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.monthly || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
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

      {/* Recent Loans */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Loan Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrower
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans?.slice(0, 5).map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {loan.loanNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loan.user?.firstName} {loan.user?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    KES {loan.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(loan.applicationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              className="input-field pl-10"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <FiDownload />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Loans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
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
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.phoneNumbers?.[0]?.number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.phoneNumbers?.[1]?.number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.idNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-16 h-2 rounded-full mr-2 ${
                            user.creditScore >= 70
                              ? "bg-green-500"
                              : user.creditScore >= 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        >
                          <div
                            className="h-2 rounded-full bg-gray-300"
                            style={{ width: `${user.creditScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{user.creditScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.stats?.totalLoans || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isProfileComplete
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.isProfileComplete ? "Complete" : "Incomplete"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewUser(user._id)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
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
    </div>
  );

  // Admin Management Component
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
      if (
        !window.confirm(
          "Are you sure you want to demote this admin? They will lose all admin privileges.",
        )
      )
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Admin Management</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <FiUserPlus />
            <span>Create New Admin</span>
          </button>
        </div>

        {/* Current Admins */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Current Administrators</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FiShield className="text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.firstName} {admin.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.idNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {admin.email !== "admin@speed-cash.com" && (
                        <button
                          onClick={() => handleDemoteFromAdmin(admin._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Demote to User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Promote Users Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Promote Users to Admin</h3>
            <div className="mt-4 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loans
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
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
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.idNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.stats?.totalLoans || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handlePromoteToAdmin(user._id)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Promote to Admin
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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

  const renderLoansTable = (loansList, showActions = true) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loan Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrower
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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

              return (
                <tr key={loan._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {loan.loanNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {loan.user?.firstName} {loan.user?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {loan.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    KES {loan.amount?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    KES {loan.amountPaid?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    KES {remainingBalance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loan.dueDate
                      ? new Date(loan.dueDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {loan.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveLoan(loan._id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectLoan(loan._id)}
                            className="text-red-600 hover:text-red-900"
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
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          Process Payment
                        </button>
                      )}
                      {loan.status === "paid" && (
                        <span className="text-gray-400 text-sm">
                          No actions needed
                        </span>
                      )}
                      <button
                        onClick={() => handleViewUser(loan.user?._id)}
                        className="text-gray-600 hover:text-gray-900 ml-2"
                        title="View User Details"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "users":
        return renderUsers();
      case "loans":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h2 className="text-xl font-semibold">All Loans</h2>
                <div className="flex space-x-2">
                  <select
                    className="input-field w-40"
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
                    className="input-field w-40"
                    onChange={(e) => {
                      const [year, month] = e.target.value.split("-");
                      setFilters({ ...filters, year, month });
                    }}
                  />
                </div>
              </div>
            </div>
            {renderLoansTable(loans || [])}
          </div>
        );
      case "pending":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Pending Loans ({pendingLoans.length})
            </h2>
            {renderLoansTable(pendingLoans)}
          </div>
        );
      case "approved":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Approved Loans ({approvedLoans.length})
            </h2>
            {renderLoansTable(approvedLoans)}
          </div>
        );
      case "partial":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Partial Loans ({partialLoans.length})
            </h2>
            {renderLoansTable(partialLoans)}
          </div>
        );
      case "paid":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Paid Loans ({paidLoans.length})
            </h2>
            {renderLoansTable(paidLoans)}
          </div>
        );
      case "defaulted":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
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
          <div className="max-w-4xl mx-auto">
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
        <title>Admin Dashboard - Speed- Cash Solutions</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-white shadow-lg transition-all duration-300 flex flex-col fixed h-full z-10 left-0 top-0`}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            {sidebarOpen ? (
              <div>
                <span className="text-xl font-bold text-primary-600">
                  Speed-Cash
                </span>
                <span className="block text-xs text-gray-500">Admin</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-primary-600 mx-auto">
                SC
              </span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-3 mb-1 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="ml-3 text-sm font-medium truncate">
                      {tab.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Admin Info */}
          <div className="p-4 border-t">
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
              {sidebarOpen && (
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Administrator
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`mt-3 flex items-center text-gray-600 hover:text-red-600 w-full px-2 py-2 rounded-lg hover:bg-gray-50 ${
                sidebarOpen ? "justify-start" : "justify-center"
              }`}
            >
              <FiLogOut size={20} />
              {sidebarOpen && <span className="ml-3 text-sm">Logout</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}
        >
          <div className="p-8">
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
    </>
  );
};

export default AdminDashboard;
