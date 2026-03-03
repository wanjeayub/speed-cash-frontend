import React from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiCalendar,
  FiCamera,
} from "react-icons/fi";
import CreditScoreGauge from "./CreditsScoreGauge";

const UserDetailsModal = ({ user, onClose, onViewLoan }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">User Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-start space-x-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {user.profilePhoto?.url ? (
                <img
                  src={user.profilePhoto.url}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-100">
                  <FiUser className="text-4xl text-gray-400" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium flex items-center">
                  <FiMail className="mr-2 text-gray-400" />
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID Number</p>
                <p className="font-medium">{user.idNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium flex items-center">
                  <FiCalendar className="mr-2 text-gray-400" />
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <FiPhone className="mr-2" />
              Phone Numbers
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {user.phoneNumbers?.map((phone, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-gray-600 mr-2">{index + 1}:</span>
                  <span className="font-medium">{phone.number}</span>
                  {phone.isPrimary && (
                    <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ID Photos */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <FiCamera className="mr-2" />
              ID Photos
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">ID Front</p>
                {user.idPhotoFront?.url ? (
                  <img
                    src={user.idPhotoFront.url}
                    alt="ID Front"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                    <p className="text-gray-400">No photo uploaded</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">ID Back</p>
                {user.idPhotoBack?.url ? (
                  <img
                    src={user.idPhotoBack.url}
                    alt="ID Back"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                    <p className="text-gray-400">No photo uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Credit Score */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Credit Score & History</h3>
            <div className="flex items-start space-x-6">
              <div className="w-48">
                <CreditScoreGauge score={user.creditScore} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium mb-2">Credit History</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {user.creditHistory?.length > 0 ? (
                    user.creditHistory.map((history, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm bg-white p-2 rounded"
                      >
                        <span>Loan #{history.loanId?.loanNumber}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            history.paymentStatus === "on_time"
                              ? "bg-green-100 text-green-800"
                              : history.paymentStatus === "late"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {history.paymentStatus}
                        </span>
                        <span className="text-gray-500">
                          {new Date(history.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No credit history available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Loans */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <FiCreditCard className="mr-2" />
              Loan History
            </h3>
            <div className="space-y-3">
              {user.loans?.length > 0 ? (
                user.loans.map((loan) => (
                  <div
                    key={loan._id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium">
                          Loan #{loan.loanNumber}
                        </span>
                        <span
                          className={`ml-3 px-2 py-1 text-xs rounded-full ${
                            loan.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : loan.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : loan.status === "paid"
                                  ? "bg-blue-100 text-blue-800"
                                  : loan.status === "defaulted"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </div>
                      <button
                        onClick={() => onViewLoan(loan)}
                        className="text-primary-600 hover:text-primary-800 text-sm"
                      >
                        Process Payment
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-medium">
                          KES {loan.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Paid</p>
                        <p className="font-medium">
                          KES {loan.amountPaid?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Balance</p>
                        <p className="font-medium">
                          KES{" "}
                          {(
                            loan.totalAmount - (loan.amountPaid || 0)
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Due Date</p>
                        <p className="font-medium">
                          {loan.dueDate
                            ? new Date(loan.dueDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No loans found for this user
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button onClick={onClose} className="btn-secondary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
