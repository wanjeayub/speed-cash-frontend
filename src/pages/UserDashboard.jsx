import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  FiHome,
  FiUser,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiCamera,
  FiUpload,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiPhone,
} from "react-icons/fi";
import { logout } from "../store/slices/authSlice";
import {
  getUserLoans,
  uploadPhoto,
  updateProfile,
  applyForLoan,
} from "../store/slices/userSlice";
import PhotoUpload from "../components/PhotoUpload";
import LoanApplication from "../components/LoanApplication";
import LoadingSpinner from "../components/LoadingSpinner";
import ProfileCompletion from "../components/ProfileCompletion";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loans, uploadProgress, loading } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLoanModal, setShowLoanModal] = useState(false);

  // Initialize phone numbers properly
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumbers: [],
  });

  // Update form when user data changes
  useEffect(() => {
    console.log("User data updated:", user);
    console.log("Phone numbers from user:", user?.phoneNumbers);

    // Extract phone numbers correctly
    let phoneNumbersArray = ["", ""];

    if (user?.phoneNumbers && user.phoneNumbers.length > 0) {
      phoneNumbersArray = user.phoneNumbers.map((p) => p.number || p);
      // Ensure we have at least 2 elements
      while (phoneNumbersArray.length < 2) {
        phoneNumbersArray.push("");
      }
    }

    setProfileForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumbers: phoneNumbersArray,
    });
  }, [user]);

  useEffect(() => {
    dispatch(getUserLoans());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Filter out empty phone numbers
    const validPhoneNumbers = profileForm.phoneNumbers.filter(
      (p) => p.trim() !== "",
    );

    if (validPhoneNumbers.length < 2) {
      toast.error("Please provide at least two phone numbers");
      return;
    }

    const result = await dispatch(
      updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phoneNumbers: validPhoneNumbers,
      }),
    );

    if (!result.error) {
      toast.success("Profile updated successfully");
    }
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...profileForm.phoneNumbers];
    newPhones[index] = value;
    setProfileForm({
      ...profileForm,
      phoneNumbers: newPhones,
    });
  };

  const handlePhotoUpload = async (file, type) => {
    await dispatch(uploadPhoto({ file, type }));
  };

  const getProfileCompletionStatus = () => {
    const hasPhoneNumbers = user?.phoneNumbers && user.phoneNumbers.length >= 2;

    const required = [
      user?.firstName,
      user?.lastName,
      user?.profilePhoto?.url,
      user?.idPhotoFront?.url,
      user?.idPhotoBack?.url,
      hasPhoneNumbers,
    ];
    return required.filter(Boolean).length;
  };

  const completionCount = getProfileCompletionStatus();
  const completionPercentage = (completionCount / 6) * 100;
  const canApplyForLoan = completionCount === 6;

  const tabs = [
    { id: "home", label: "Home", icon: FiHome },
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "loans", label: "My Loans", icon: FiCreditCard },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName || "User"}! 👋
              </h1>
              <p className="text-primary-100">
                {canApplyForLoan
                  ? "Your profile is complete. You can now apply for loans."
                  : `Please complete your profile (${completionCount}/6) to start applying for loans.`}
              </p>
            </div>

            {/* Profile Completion Progress */}
            {!canApplyForLoan && (
              <ProfileCompletion
                user={user}
                completionPercentage={completionPercentage}
                onUpload={handlePhotoUpload}
                uploadProgress={uploadProgress}
              />
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowLoanModal(true)}
                disabled={!canApplyForLoan}
                className={`p-6 rounded-xl text-left transition-all ${
                  canApplyForLoan
                    ? "bg-primary-50 hover:bg-primary-100 cursor-pointer"
                    : "bg-gray-100 cursor-not-allowed opacity-50"
                }`}
              >
                <FiCreditCard className="text-3xl text-primary-600 mb-3" />
                <h3 className="font-semibold mb-1">Apply for Loan</h3>
                <p className="text-sm text-gray-600">
                  Get quick cash for your needs
                </p>
              </button>

              <button
                onClick={() => setActiveTab("loans")}
                className="p-6 bg-green-50 hover:bg-green-100 rounded-xl text-left transition-all"
              >
                <FiClock className="text-3xl text-green-600 mb-3" />
                <h3 className="font-semibold mb-1">Loan Status</h3>
                <p className="text-sm text-gray-600">
                  Track your loan applications
                </p>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className="p-6 bg-purple-50 hover:bg-purple-100 rounded-xl text-left transition-all"
              >
                <FiUser className="text-3xl text-purple-600 mb-3" />
                <h3 className="font-semibold mb-1">Update Profile</h3>
                <p className="text-sm text-gray-600">
                  Complete your profile information
                </p>
              </button>
            </div>

            {/* Recent Loans */}
            {loans.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Recent Loans</h2>
                <div className="space-y-4">
                  {loans.slice(0, 3).map((loan) => (
                    <div
                      key={loan._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Loan #{loan.loanNumber}</p>
                        <p className="text-sm text-gray-600">
                          Amount: KES {loan.amount?.toLocaleString() || 0}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          loan.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : loan.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : loan.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : loan.status === "paid"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {loan.status?.charAt(0).toUpperCase() +
                          loan.status?.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "profile":
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Photo Upload */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
              <PhotoUpload
                type="profile"
                currentPhoto={user?.profilePhoto?.url}
                onUpload={(file) => handlePhotoUpload(file, "profile")}
                progress={uploadProgress?.profile}
              />
            </div>

            {/* ID Photos */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">ID Photos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PhotoUpload
                  type="idFront"
                  label="ID Front"
                  currentPhoto={user?.idPhotoFront?.url}
                  onUpload={(file) => handlePhotoUpload(file, "idFront")}
                  progress={uploadProgress?.idFront}
                />
                <PhotoUpload
                  type="idBack"
                  label="ID Back"
                  currentPhoto={user?.idPhotoBack?.url}
                  onUpload={(file) => handlePhotoUpload(file, "idBack")}
                  progress={uploadProgress?.idBack}
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>

              {/* Display current phone numbers status */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Current Status:</strong>{" "}
                  {user?.phoneNumbers?.length || 0} phone number(s) on file
                </p>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          firstName: e.target.value,
                        })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          lastName: e.target.value,
                        })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="input-field bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Number
                  </label>
                  <input
                    type="text"
                    value={user?.idNumber}
                    disabled
                    className="input-field bg-gray-100"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Numbers (Minimum 2)
                  </label>
                  {profileForm.phoneNumbers.map((phone, index) => (
                    <div key={index} className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) =>
                          handlePhoneChange(index, e.target.value)
                        }
                        className="input-field pl-10"
                        placeholder={`Phone number ${index + 1} (e.g., 0712345678)`}
                        required
                      />
                    </div>
                  ))}
                  <p className="text-xs text-gray-500">
                    Format: 10 digits starting with 0 (e.g., 0712345678)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        );

      // ... rest of the cases remain the same
      case "loans":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">My Loans</h1>
              {canApplyForLoan && (
                <button
                  onClick={() => setShowLoanModal(true)}
                  className="btn-primary"
                >
                  Apply for New Loan
                </button>
              )}
            </div>

            {loans.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <FiCreditCard className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Loans Yet</h3>
                <p className="text-gray-600 mb-4">
                  You haven't applied for any loans yet.
                </p>
                {canApplyForLoan && (
                  <button
                    onClick={() => setShowLoanModal(true)}
                    className="btn-primary"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loan Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loans.map((loan) => (
                        <tr key={loan._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {loan.loanNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            KES {loan.amount?.toLocaleString() || 0}
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
                                        : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {loan.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {loan.applicationDate
                              ? new Date(
                                  loan.applicationDate,
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {loan.dueDate
                              ? new Date(loan.dueDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => {}}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case "settings":
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="form-checkbox rounded"
                      />
                      <span className="text-sm">
                        Email notifications for loan updates
                      </span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="form-checkbox rounded"
                      />
                      <span className="text-sm">
                        SMS notifications for payment reminders
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Security</h3>
                  <button className="btn-secondary">Change Password</button>
                </div>

                <div className="pt-6 border-t">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Speedy Cash Solutions</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar - Fixed position */}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-white shadow-lg transition-all duration-300 flex flex-col fixed h-full z-10 left-0 top-0`}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            {sidebarOpen ? (
              <span className="text-xl font-bold text-primary-600">
                SpeedyCash
              </span>
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
                    <span className="ml-3 text-sm font-medium">
                      {tab.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Info */}
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
                    {user?.firstName || "User"} {user?.lastName || ""}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || ""}
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

        {/* Main Content - With left margin to account for fixed sidebar */}
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-20"
          }`}
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

      {/* Loan Application Modal */}
      {showLoanModal && (
        <LoanApplication
          onClose={() => setShowLoanModal(false)}
          onSubmit={async (data) => {
            await dispatch(applyForLoan(data));
            setShowLoanModal(false);
          }}
        />
      )}
    </>
  );
};

export default UserDashboard;
