import React from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiCamera,
  FiCreditCard,
} from "react-icons/fi";
import PhotoUpload from "./PhotoUpload";

const ProfileCompletion = ({
  user,
  completionPercentage,
  onUpload,
  uploadProgress,
}) => {
  const requirements = [
    {
      label: "First Name",
      met: !!user?.firstName,
      icon: FiCheckCircle,
    },
    {
      label: "Last Name",
      met: !!user?.lastName,
      icon: FiCheckCircle,
    },
    {
      label: "Profile Photo",
      met: !!user?.profilePhoto?.url,
      icon: FiCamera,
    },
    {
      label: "ID Front Photo",
      met: !!user?.idPhotoFront?.url,
      icon: FiCreditCard,
    },
    {
      label: "ID Back Photo",
      met: !!user?.idPhotoBack?.url,
      icon: FiCreditCard,
    },
    {
      label: "Two Phone Numbers",
      met: user?.phoneNumbers?.length >= 2,
      icon: FiCheckCircle,
    },
  ];

  const pendingItems = requirements.filter((r) => !r.met);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <FiAlertCircle className="text-yellow-600 text-2xl" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">Complete Your Profile</h3>
          <p className="text-gray-600 mb-3">
            You need to complete the following to apply for loans:
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          {/* Pending Items */}
          {pendingItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Pending Items:
              </p>
              {pendingItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <item.icon className="text-gray-400" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Upload Section */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {!user?.profilePhoto?.url && (
          <PhotoUpload
            type="profile"
            onUpload={(file) => onUpload(file, "profile")}
            progress={uploadProgress.profile}
          />
        )}
        {!user?.idPhotoFront?.url && (
          <PhotoUpload
            type="idFront"
            label="ID Front"
            onUpload={(file) => onUpload(file, "idFront")}
            progress={uploadProgress.idFront}
          />
        )}
        {!user?.idPhotoBack?.url && (
          <PhotoUpload
            type="idBack"
            label="ID Back"
            onUpload={(file) => onUpload(file, "idBack")}
            progress={uploadProgress.idBack}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileCompletion;
