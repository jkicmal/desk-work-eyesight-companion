import moment, { Moment } from "moment";
import { useRef, useState } from "react";

interface UseTimerOptions {
  duration: number;
  unit: moment.unitOfTime.DurationConstructor;
  displayFormat: string;
  refreshTime: number;
  onTimerEnd: Callback;
}

interface TimerState {
  endTime: Moment;
  currentDisplay: string;
  isRunning: boolean;
  maxTimeDiff: number;
  currentTimeDiff: number;
}

type Callback = () => void;

const formatTimeDiff = (diff: number, format: string) =>
  moment.utc(diff).format(format);

const calculateTimteDiff = (endTime: Moment) =>
  Math.max(endTime.diff(moment()), 0);

const useTimer = ({
  duration = 15,
  unit = "minutes",
  displayFormat = "MM:ss",
  refreshTime = 100,
  onTimerEnd = () => {},
}: Partial<UseTimerOptions>) => {
  const timerInterval = useRef<NodeJS.Timeout>();

  const onTimerEndCallback = useRef(onTimerEnd);

  const [
    { isRunning, currentDisplay, maxTimeDiff, currentTimeDiff },
    setState,
  ] = useState<TimerState>(() => {
    const endTime = moment().add(duration, unit);
    const maxTimeDiff = calculateTimteDiff(endTime);
    return {
      maxTimeDiff,
      endTime,
      currentDisplay: formatTimeDiff(endTime.diff(moment()), displayFormat),
      isRunning: false,
      currentTimeDiff: maxTimeDiff,
    };
  });

  const setEndTime = (endTime: Moment) =>
    setState((state) => ({ ...state, endTime }));

  const setIsRunning = (isRunning: boolean) =>
    setState((state) => ({ ...state, isRunning }));

  const setTimerInterval = (callback: Callback) => {
    timerInterval.current = setInterval(callback, refreshTime);
  };

  const setTimerEndCallback = (callback: Callback) =>
    (onTimerEndCallback.current = callback);

  const clearTimerInterval = () =>
    timerInterval.current && clearInterval(timerInterval.current);

  const startTimer = () => {
    if (!isRunning) {
      clearTimerInterval();
      setEndTime(moment().add(duration, unit));
      setIsRunning(true);
      setTimerInterval(() => {
        setState((state) => {
          const diff = Math.max(state.endTime.diff(moment()), 0);
          if (diff <= 0) {
            onTimerEndCallback.current();
            stopTimer();
          }
          const currentDisplay = formatTimeDiff(diff, displayFormat);
          return { ...state, currentDisplay, currentTimeDiff: diff };
        });
      });
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearTimerInterval();
  };

  return {
    startTimer,
    stopTimer,
    currentDisplay,
    setTimerEndCallback,
    isRunning,
    maxTimeDiff,
    currentTimeDiff,
  };
};

export default useTimer;
