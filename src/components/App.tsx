import React, { useEffect } from "react";
import useTimer from "../hooks/useTimer";
import useSound from "use-sound";
import popMP3 from "../media/pop.mp3";
import ProgressBar from "./ProgressBar";
import TimerDisplay from "./TimerDisplay";

function App() {
  const lookAwayTimer = useTimer({
    duration: 15,
    displayFormat: "mm:ss",
    refreshTime: 33,
    unit: "seconds",
  });

  const workTimer = useTimer({
    duration: 15,
    displayFormat: "mm:ss",
    refreshTime: 33,
    unit: "minutes",
  });

  const [play] = useSound(popMP3);

  useEffect(() => {
    lookAwayTimer.setTimerEndCallback(() => {
      workTimer.startTimer();
      play();
    });

    workTimer.setTimerEndCallback(() => {
      lookAwayTimer.startTimer();
      play();
    });
  }, [lookAwayTimer, workTimer, play]);

  useEffect(() => {
    document.title = workTimer.currentDisplay;
  }, [workTimer.currentDisplay, lookAwayTimer.currentDisplay]);

  const handleTimerClick = () => {
    if (workTimer.isRunning) {
      workTimer.stopTimer();
      lookAwayTimer.startTimer();
    } else if (lookAwayTimer.isRunning) {
      lookAwayTimer.stopTimer();
      workTimer.startTimer();
    } else {
      workTimer.startTimer();
    }
  };

  const renderWorkTimer = (
    <>
      <TimerDisplay
        format="mm:ss"
        name="work"
        ticks={workTimer.currentTimeDiff}
        onClick={handleTimerClick}
      />
      <ProgressBar
        percentage={workTimer.currentTimeDiff / workTimer.maxTimeDiff}
      />
    </>
  );

  const renderLookAwayTimer = (
    <>
      <TimerDisplay
        format="mm:ss"
        name="look away"
        ticks={lookAwayTimer.currentTimeDiff}
        onClick={handleTimerClick}
      />
      <ProgressBar
        percentage={lookAwayTimer.currentTimeDiff / lookAwayTimer.maxTimeDiff}
      />
    </>
  );

  const isAnyTimerRunning = workTimer.isRunning || lookAwayTimer.isRunning;

  return (
    <div className="app">
      {!isAnyTimerRunning
        ? renderWorkTimer
        : workTimer.isRunning
        ? renderWorkTimer
        : renderLookAwayTimer}
    </div>
  );
}

export default App;
