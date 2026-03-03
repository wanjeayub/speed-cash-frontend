import React, { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiCamera,
  FiCreditCard,
  FiUser,
} from "react-icons/fi";
import PhotoUpload from "./PhotoUpload";

const ProfileCompletion = ({
  user,
  completionPercentage,
  onUpload,
  uploadProgress,
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    // Animate the progress bar
    const timer = setTimeout(() => {
      setAnimatedPercentage(completionPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [completionPercentage]);

  const requirements = [
    {
      label: "First Name",
      met: !!user?.firstName,
      icon: FiUser,
    },
    {
      label: "Last Name",
      met: !!user?.lastName,
      icon: FiUser,
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
  const completedItems = requirements.filter((r) => r.met);

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
            {pendingItems.length === 0
              ? "Your profile is complete! You can now apply for loans."
              : `You need to complete ${pendingItems.length} more item(s) to apply for loans:`}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${animatedPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-right">
            {completedItems.length}/{requirements.length} completed
          </p>

          {/* Requirements List */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                {req.met ? (
                  <FiCheckCircle className="text-green-500 flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <span
                  className={
                    req.met ? "text-gray-600" : "text-gray-800 font-medium"
                  }
                >
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Upload Section */}
      {pendingItems.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Upload Missing Documents</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {!user?.profilePhoto?.url && (
              <PhotoUpload
                type="profile"
                onUpload={(file) => onUpload(file, "profile")}
                progress={uploadProgress?.profile}
              />
            )}
            {!user?.idPhotoFront?.url && (
              <PhotoUpload
                type="idFront"
                label="ID Front"
                onUpload={(file) => onUpload(file, "idFront")}
                progress={uploadProgress?.idFront}
              />
            )}
            {!user?.idPhotoBack?.url && (
              <PhotoUpload
                type="idBack"
                label="ID Back"
                onUpload={(file) => onUpload(file, "idBack")}
                progress={uploadProgress?.idBack}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletion;
