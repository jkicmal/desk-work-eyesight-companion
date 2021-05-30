import React, { useEffect, useState } from "react";
import moment from "moment";
import useTimer from "../hooks/useTimer";
import useSound from "use-sound";
import popMP3 from "../media/pop.mp3";
import ProgressBar from "./ProgressBar";
import TimerDisplay from "./TimerDisplay";

function App() {
  const [breakMode, setBreakMode] = useState(false);

  const workTimer = useTimer({
    duration: 1.5,
    unit: "hours",
  });

  const lookTimer = useTimer({
    duration: 15,
    unit: "minutes",
  });

  const [playPopSound] = useSound(popMP3);

  const startTimers = () => {
    workTimer.startTimer();
    lookTimer.startTimer();
  };

  const resetTimers = () => {
    workTimer.resetTimer();
    lookTimer.resetTimer();
  };

  const stopTimers = () => {
    workTimer.stopTimer();
    lookTimer.stopTimer();
  };

  useEffect(() => {
    lookTimer.setTimerEndCallback(() => {
      playPopSound();
      lookTimer.startTimer();
    });
    workTimer.setTimerEndCallback(() => {
      playPopSound();
      stopTimers();
      setBreakMode(true);
      // workTimer.startTimer();
    });
    // eslint-disable-next-line
  }, [playPopSound]);

  useEffect(() => {
    const workTime = moment.utc(workTimer.currentTimeDiff).format("HH:mm:ss");
    const lookTime = moment.utc(lookTimer.currentTimeDiff).format("HH:mm:ss");
    document.title = `${workTime} - ${lookTime}`;
  }, [workTimer.currentTimeDiff, lookTimer.currentTimeDiff]);

  const renderWorkTimer = (
    <div>
      {breakMode ? (
        <div>
          <button
            onClick={() => {
              setBreakMode(false);
              startTimers();
            }}
          >
            Ready!
          </button>
        </div>
      ) : (
        <div>
          <div>
            <TimerDisplay
              format="HH:mm:ss"
              name="work"
              ticks={workTimer.currentTimeDiff}
            />
            <ProgressBar
              percentage={workTimer.currentTimeDiff / workTimer.maxTimeDiff}
            />
          </div>
          <div className="divider" />
          <div>
            <TimerDisplay
              format="mm:ss"
              name="look"
              ticks={lookTimer.currentTimeDiff}
            />
            <ProgressBar
              percentage={lookTimer.currentTimeDiff / lookTimer.maxTimeDiff}
            />
          </div>
          <button onClick={() => startTimers()}>Start Timers</button>
          <button onClick={() => resetTimers()}>Reset Timers</button>
          <button onClick={() => stopTimers()}>Stop Timers</button>
        </div>
      )}
    </div>
  );

  return <div className="app">{renderWorkTimer}</div>;
}

export default App;
