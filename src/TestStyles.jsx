import React from "react";

const TestStyles = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
            Test
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Tailwind CSS is Working!
          </h1>
          <p className="text-gray-600 mt-4">
            If you can see this card with proper styling (blue text, rounded
            corners, shadow), then Tailwind CSS is properly configured.
          </p>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Test Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestStyles;
