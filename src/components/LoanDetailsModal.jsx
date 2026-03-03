import React, { useState, useEffect } from "react";
import {
  FiX,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiClock,
  FiCalendar,
  FiPercent,
  FiDollarSign,
  FiInfo,
} from "react-icons/fi";
import toast from "react-hot-toast";

const LoanDetailsModal = ({ loan, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLoan, setEditedLoan] = useState({
    amount: loan?.amount || "",
    purpose: loan?.purpose || "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loan) {
      setEditedLoan({
        amount: loan.amount,
        purpose: loan.purpose || "",
      });
    }
  }, [loan]);

  if (!loan) return null;

  const canEdit = loan.status === "pending";

  // Calculate loan details
  const principal = loan.amount || 0;
  const interestRate = loan.interestRate || 10;
  const interestAmount = (principal * interestRate) / 100;
  const totalRepayment = loan.totalAmount || principal + interestAmount;
  const amountPaid = loan.amountPaid || 0;
  const remainingBalance = totalRepayment - amountPaid;

  // Calculate daily interest (for information)
  const dailyInterest = interestAmount / 30; // Assuming 30 days month

  // Format dates
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days remaining or overdue
  const getDaysInfo = () => {
    if (!loan.dueDate) return null;

    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        text: `${diffDays} days remaining`,
        className: "text-green-600",
      };
    } else if (diffDays < 0) {
      return {
        text: `${Math.abs(diffDays)} days overdue`,
        className: "text-red-600",
      };
    } else {
      return { text: "Due today", className: "text-yellow-600" };
    }
  };

  const daysInfo = getDaysInfo();

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      partial: "bg-purple-100 text-purple-800",
      paid: "bg-blue-100 text-blue-800",
      defaulted: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleUpdate = async () => {
    // Validate
    if (editedLoan.amount < 100) {
      toast.error("Amount must be at least KES 100");
      return;
    }
    if (editedLoan.amount > 1000000) {
      toast.error("Amount cannot exceed KES 1,000,000");
      return;
    }

    setLoading(true);
    try {
      await onUpdate(loan._id, {
        amount: parseFloat(editedLoan.amount),
        purpose: editedLoan.purpose?.trim() || "Personal use",
      });
      setIsEditing(false);
      toast.success("Loan updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update loan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this loan application? This action cannot be undone.",
      )
    ) {
      setLoading(true);
      try {
        await onDelete(loan._id);
        toast.success("Loan deleted successfully");
        onClose();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete loan");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold">Loan Details</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}
              >
                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Loan #{loan.loanNumber}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {canEdit && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit loan"
                  disabled={loading}
                >
                  <FiEdit2 size={20} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete loan"
                  disabled={loading}
                >
                  <FiTrash2 size={20} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Timeline Info */}
          {daysInfo && loan.status !== "paid" && loan.status !== "rejected" && (
            <div
              className={`p-4 rounded-lg ${daysInfo.className.replace("text-", "bg-").replace("600", "50")}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Payment Timeline</span>
                <span className={`font-semibold ${daysInfo.className}`}>
                  {daysInfo.text}
                </span>
              </div>
            </div>
          )}

          {/* Loan Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <FiDollarSign className="text-blue-600" size={20} />
                <span className="text-xs text-blue-600">Principal</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                KES {principal.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <FiPercent className="text-purple-600" size={20} />
                <span className="text-xs text-purple-600">
                  Interest ({interestRate}%)
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                KES {interestAmount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                ≈ KES {dailyInterest.toFixed(0)}/day
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <FiDollarSign className="text-green-600" size={20} />
                <span className="text-xs text-green-600">Total to Repay</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                KES {totalRepayment.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Payment Progress */}
          {(loan.status === "approved" ||
            loan.status === "partial" ||
            loan.status === "paid") && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Payment Progress</span>
                <span className="text-sm font-medium">
                  KES {amountPaid.toLocaleString()} / KES{" "}
                  {totalRepayment.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(amountPaid / totalRepayment) * 100}%` }}
                ></div>
              </div>
              {remainingBalance > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Remaining Balance:{" "}
                  <span className="font-semibold">
                    KES {remainingBalance.toLocaleString()}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Loan Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Application Date</p>
              <p className="font-medium flex items-center mt-1">
                <FiCalendar className="mr-2 text-gray-400" size={14} />
                {formatDate(loan.applicationDate)}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="font-medium flex items-center mt-1">
                <FiClock className="mr-2 text-gray-400" size={14} />
                {formatDate(loan.dueDate)}
              </p>
            </div>

            {loan.approvalDate && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Approval Date</p>
                <p className="font-medium">{formatDate(loan.approvalDate)}</p>
              </div>
            )}

            {loan.repaymentDate && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Repayment Date</p>
                <p className="font-medium">{formatDate(loan.repaymentDate)}</p>
              </div>
            )}
          </div>

          {/* Purpose Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FiInfo className="text-gray-400 mr-2" size={16} />
              <p className="text-sm text-gray-500">Loan Purpose</p>
            </div>
            {isEditing ? (
              <textarea
                value={editedLoan.purpose}
                onChange={(e) =>
                  setEditedLoan({ ...editedLoan, purpose: e.target.value })
                }
                className="input-field"
                rows="2"
                placeholder="Enter loan purpose (optional)"
              />
            ) : (
              <p className="text-gray-900">{loan.purpose || "Not specified"}</p>
            )}
          </div>

          {/* Edit Mode - Amount Field */}
          {isEditing && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (KES)
              </label>
              <input
                type="number"
                value={editedLoan.amount}
                onChange={(e) =>
                  setEditedLoan({ ...editedLoan, amount: e.target.value })
                }
                className="input-field"
                min="100"
                max="1000000"
                step="100"
              />
              <p className="text-xs text-gray-500 mt-2">
                Min: KES 100 | Max: KES 1,000,000
              </p>
            </div>
          )}

          {/* Payment History */}
          {loan.payments && loan.payments.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Payment History</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {loan.payments.map((payment, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-green-600">
                        KES {payment.amount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(payment.date)}
                      </p>
                    </div>
                    {payment.receiptNumber && (
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        Receipt: {payment.receiptNumber}
                      </span>
                    )}
                    {payment.notes && (
                      <p className="text-xs text-gray-500 italic">
                        {payment.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Credit Check Info */}
          {loan.creditCheckAtApplication && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">
                Credit Score at Application
              </p>
              <p className="font-medium">{loan.creditCheckAtApplication}</p>
            </div>
          )}

          {/* Edit/Save Actions */}
          {isEditing && (
            <div className="flex space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedLoan({
                    amount: loan.amount,
                    purpose: loan.purpose || "",
                  });
                }}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
                disabled={loading}
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <FiSave />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Status-specific messages */}
          {loan.status === "pending" && !isEditing && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Pending Approval:</strong> Your loan application is
                being reviewed by our team. You can edit or delete it while it's
                pending.
              </p>
            </div>
          )}

          {loan.status === "approved" && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Approved!</strong> Your loan has been approved. The
                funds will be disbursed to your account shortly.
              </p>
            </div>
          )}

          {loan.status === "rejected" && loan.rejectionReason && (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Rejection Reason:</strong> {loan.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsModal;
