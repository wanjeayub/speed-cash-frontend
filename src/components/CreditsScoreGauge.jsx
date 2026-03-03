import React from "react";

const CreditScoreGauge = ({ score = 50 }) => {
  // Ensure score is between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, score));

  // Calculate rotation for the pointer (0-100 maps to -90deg to +90deg)
  const rotation = (normalizedScore - 50) * 1.8; // -90 to +90 degrees

  // Determine color based on score
  const getColor = () => {
    if (normalizedScore >= 70) return "#10B981"; // Green
    if (normalizedScore >= 40) return "#FBBF24"; // Yellow
    return "#EF4444"; // Red
  };

  const getStatusText = () => {
    if (normalizedScore >= 70) return "Good Credit";
    if (normalizedScore >= 40) return "Fair Credit";
    return "Poor Credit";
  };

  const getStatusDescription = () => {
    if (normalizedScore >= 70) return "Customer pays on time";
    if (normalizedScore >= 40) return "Occasional late payments";
    return "History of defaults/delays";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Gauge Background */}
        <svg
          width="192"
          height="96"
          viewBox="0 0 192 96"
          className="absolute top-0 left-0"
        >
          {/* Red zone (0-40) */}
          <path
            d="M16 80 A 80 80 0 0 1 67.2 26.4"
            fill="none"
            stroke="#EF4444"
            strokeWidth="12"
            strokeLinecap="round"
            strokeOpacity="0.3"
          />
          {/* Yellow zone (40-70) */}
          <path
            d="M67.2 26.4 A 80 80 0 0 1 124.8 26.4"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="12"
            strokeLinecap="round"
            strokeOpacity="0.3"
          />
          {/* Green zone (70-100) */}
          <path
            d="M124.8 26.4 A 80 80 0 0 1 176 80"
            fill="none"
            stroke="#10B981"
            strokeWidth="12"
            strokeLinecap="round"
            strokeOpacity="0.3"
          />
        </svg>

        {/* Pointer */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 origin-bottom transition-transform duration-500"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-1 h-20 bg-gray-800 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-800 rounded-full absolute -top-1 -left-1"></div>
        </div>

        {/* Center dot */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-800 rounded-full"></div>
      </div>

      {/* Score and Status */}
      <div className="text-center mt-4">
        <div className="text-3xl font-bold" style={{ color: getColor() }}>
          {normalizedScore}
        </div>
        <div className="text-sm font-medium mt-1" style={{ color: getColor() }}>
          {getStatusText()}
        </div>
        <p className="text-xs text-gray-500 mt-1">{getStatusDescription()}</p>
      </div>

      {/* Legend */}
      <div className="flex justify-between w-full mt-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span>Poor</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
          <span>Fair</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span>Good</span>
        </div>
      </div>
    </div>
  );
};

export default CreditScoreGauge;
