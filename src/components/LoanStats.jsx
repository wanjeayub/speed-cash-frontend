import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { FiDownload, FiCalendar } from "react-icons/fi";

const LoanStats = ({ stats, onYearChange }) => {
  if (!stats) return null;

  const COLORS = {
    pending: "#FBBF24",
    approved: "#34D399",
    partial: "#60A5FA",
    paid: "#10B981",
    defaulted: "#EF4444",
  };

  const monthlyData =
    stats.monthly?.map((item) => ({
      month: new Date(2024, item._id - 1).toLocaleString("default", {
        month: "short",
      }),
      amount: item.totalAmount,
      count: item.totalLoans,
      interest: item.totalInterest,
    })) || [];

  const statusData =
    stats.byStatus?.map((item) => ({
      name: item._id,
      value: item.count,
      amount: item.totalAmount,
    })) || [];

  const totalLoans = statusData.reduce((sum, item) => sum + item.value, 0);
  const totalAmount = statusData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Loan Statistics</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-gray-400" />
            <select
              className="input-field w-32"
              value={stats.currentYear}
              onChange={(e) => onYearChange(e.target.value)}
            >
              {[2024, 2023, 2022, 2021].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <FiDownload />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Total Loans</p>
          <p className="text-3xl font-bold mt-1">{totalLoans}</p>
          <p className="text-sm text-gray-500 mt-2">Year {stats.currentYear}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Total Amount</p>
          <p className="text-3xl font-bold mt-1">
            KES {totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Average Loan</p>
          <p className="text-3xl font-bold mt-1">
            KES{" "}
            {totalLoans
              ? Math.round(totalAmount / totalLoans).toLocaleString()
              : 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Default Rate</p>
          <p className="text-3xl font-bold mt-1">
            {stats.byStatus?.find((s) => s._id === "defaulted")?.value || 0}%
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Loan Amounts */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Loan Amounts</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="amount" fill="#3B82F6" name="Loan Amount" />
              <Bar dataKey="interest" fill="#10B981" name="Interest" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Loan Count */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Loan Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8B5CF6"
                name="Number of Loans"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Loan Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Loan Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
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
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name] || "#CBD5E1"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Amounts */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Amount by Status</h3>
          <div className="space-y-4">
            {statusData.map((status) => (
              <div key={status.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{status.name}</span>
                  <span className="font-medium">
                    KES {status.amount?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(status.amount / totalAmount) * 100}%`,
                      backgroundColor: COLORS[status.name] || "#CBD5E1",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Monthly Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Interest
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyData.map((month) => (
                <tr key={month.month} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {month.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{month.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    KES {month.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    KES{" "}
                    {month.count
                      ? Math.round(month.amount / month.count).toLocaleString()
                      : 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    KES {month.interest.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoanStats;
