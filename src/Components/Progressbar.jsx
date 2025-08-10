import React from "react";

const ProgressBar = ({ value }) => {
  return (
    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 mt-2">
      <div
        className="bg-green-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
