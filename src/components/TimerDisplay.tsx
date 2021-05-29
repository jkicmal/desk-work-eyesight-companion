import moment from "moment";
import React from "react";

interface TimerDisplayProps {
  ticks: number;
  name: string;
  format: string;
  onClick: () => void;
}

const TimerDisplay = ({
  ticks = 0,
  name = "",
  format = "mm:ss",
  onClick = () => {},
}: Partial<TimerDisplayProps>) => {
  return (
    <>
      <div className="timer-display-name">{name}</div>
      <div className="timer-display" onClick={onClick}>
        {moment.utc(ticks).format(format)}
      </div>
    </>
  );
};

export default TimerDisplay;
