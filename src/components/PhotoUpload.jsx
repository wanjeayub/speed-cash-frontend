import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiCamera, FiCheckCircle } from "react-icons/fi";

const PhotoUpload = ({ type, label, currentPhoto, onUpload, progress }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const getLabel = () => {
    if (type === "profile") return "Profile Photo";
    if (type === "idFront") return "ID Front";
    if (type === "idBack") return "ID Back";
    return label || "Upload Photo";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {getLabel()}
      </label>

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary-500 bg-primary-50"
            : currentPhoto
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-primary-400"
        }`}
      >
        <input {...getInputProps()} />

        {currentPhoto ? (
          <div className="space-y-2">
            <img
              src={currentPhoto}
              alt={getLabel()}
              className="mx-auto max-h-32 rounded-lg object-cover"
            />
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <FiCheckCircle />
              <span className="text-sm">Uploaded</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {type === "profile" ? (
              <FiCamera className="mx-auto text-4xl text-gray-400" />
            ) : (
              <FiUpload className="mx-auto text-4xl text-gray-400" />
            )}
            <p className="text-sm text-gray-600">
              {isDragActive
                ? "Drop the image here"
                : `Drag & drop or click to upload ${getLabel()}`}
            </p>
            <p className="text-xs text-gray-500">
              Max file size: 5MB (JPG, PNG, GIF)
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {progress > 0 && progress < 100 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;
