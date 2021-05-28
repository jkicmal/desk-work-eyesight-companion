import React, { useEffect } from "react";
import useTimer from "../hooks/useTimer";
import useSound from "use-sound";
import popMP3 from "../media/pop.mp3";

function App() {
  const lookAwayTimer = useTimer({
    duration: 15,
    displayFormat: "mm:ss",
    refreshTime: 100,
    unit: "seconds",
  });

  const workTimer = useTimer({
    duration: 10,
    displayFormat: "mm:ss",
    refreshTime: 100,
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

  const isAnyTimerRunning = workTimer.isRunning || lookAwayTimer.isRunning;

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

  return (
    <div className="app">
      <div>
        <div className="timer-display-name">
          {!isAnyTimerRunning
            ? "work"
            : workTimer.isRunning
            ? "work"
            : "look away"}
        </div>
        <div className="timer-display" onClick={handleTimerClick}>
          {!isAnyTimerRunning
            ? workTimer.currentDisplay
            : workTimer.isRunning
            ? workTimer.currentDisplay
            : lookAwayTimer.currentDisplay}
        </div>
      </div>
    </div>
  );
}

export default App;
