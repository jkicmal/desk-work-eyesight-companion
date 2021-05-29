import React from "react";

interface ProgresBarProps {
  percentage: number;
}

const ProgressBar = ({ percentage }: ProgresBarProps) => {
  return (
    <div className="progress-bar">
      <div
        style={{ width: Math.min(Math.max(percentage * 100, 0), 100) + "%" }}
      ></div>
    </div>
  );
};

export default ProgressBar;
