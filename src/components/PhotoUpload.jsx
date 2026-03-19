import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiCamera, FiCheckCircle, FiX, FiLock } from "react-icons/fi";

const PhotoUpload = ({
  type,
  label,
  currentPhoto,
  onUpload,
  progress,
  disabled = false,
  disabledMessage = "Cannot change ID photos while loans are active",
}) => {
  const [preview, setPreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Clean up preview when component unmounts
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (disabled) {
        setUploadError(disabledMessage);
        return;
      }

      if (rejectedFiles.length > 0) {
        setUploadError("File too large or invalid format. Max size: 5MB");
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setUploadError(null);
        setImageError(false);

        // Call onUpload with the file
        onUpload(file);
      }
    },
    [onUpload, disabled, disabledMessage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled: disabled,
  });

  const getLabel = () => {
    if (type === "profile") return "Profile Photo";
    if (type === "idFront") return "ID Front";
    if (type === "idBack") return "ID Back";
    return label || "Upload Photo";
  };

  // Determine which image to show
  const imageToShow = preview || currentPhoto;
  const showImage = imageToShow && !imageError;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {getLabel()}
      </label>

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          disabled
            ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
            : isDragActive
              ? "border-primary-500 bg-primary-50 cursor-pointer"
              : showImage
                ? "border-green-500 bg-green-50 cursor-pointer"
                : "border-gray-300 hover:border-primary-400 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <input {...getInputProps()} disabled={disabled} />

        {disabled && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg flex items-center justify-center z-10">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <FiLock className="text-gray-500" size={20} />
            </div>
          </div>
        )}

        {showImage ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={imageToShow}
                alt={getLabel()}
                className="mx-auto max-h-32 rounded-lg object-cover border-2 border-white shadow"
                onLoad={() => {
                  setImageLoaded(true);
                  setImageError(false);
                }}
                onError={(e) => {
                  console.error("Image failed to load:", imageToShow);
                  setImageError(true);
                  e.target.onerror = null;
                  // Try reloading with a timestamp to bypass cache
                  if (currentPhoto && !currentPhoto.includes("?")) {
                    e.target.src = `${currentPhoto}?t=${new Date().getTime()}`;
                  }
                }}
              />
              {progress > 0 && progress < 100 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {progress}%
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <FiCheckCircle />
              <span className="text-sm">
                {currentPhoto ? "Uploaded" : "Processing..."}
              </span>
            </div>
            {currentPhoto && !disabled && (
              <p className="text-xs text-gray-500">Click to replace</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {type === "profile" ? (
              <FiCamera className="mx-auto text-4xl text-gray-400" />
            ) : (
              <FiUpload className="mx-auto text-4xl text-gray-400" />
            )}
            <p className="text-sm text-gray-600">
              {disabled
                ? disabledMessage
                : isDragActive
                  ? "Drop the image here"
                  : `Drag & drop or click to upload`}
            </p>
            <p className="text-xs text-gray-500">
              Max file size: 5MB (JPG, PNG, GIF)
            </p>
          </div>
        )}

        {/* Progress Bar - Overlay during upload */}
        {progress > 0 && progress < 100 && !showImage && !disabled && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="w-3/4">
              <div className="bg-white rounded-full h-2.5 mb-2">
                <div
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-white text-xs text-center">
                {progress}% uploaded
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          <FiX size={16} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Disabled Message */}
      {disabled && currentPhoto && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
          <FiLock size={16} />
          <span>This photo is locked while you have active loans</span>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
