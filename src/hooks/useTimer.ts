import moment, { Moment } from "moment";
import { useCallback, useRef, useState } from "react";

type TimeUnit = moment.unitOfTime.DurationConstructor;

interface UseTimerOptions {
  duration: number;
  unit: TimeUnit;
  refreshTime: number;
  onTimerEnd: Callback;
}

interface TimerState {
  endTime: Moment;
  isRunning: boolean;
  maxTimeDiff: number;
  currentTimeDiff: number;
}

interface UseTimerReturn {
  currentTimeDiff: number;
  startTimer: Callback;
  stopTimer: Callback;
  setTimerEndCallback: (callback: Callback) => void;
  isRunning: boolean;
  maxTimeDiff: number;
  resetTimer: Callback;
}

type Callback = () => void;

const calculateTimeDiff = (endTime: Moment) =>
  Math.max(endTime.diff(moment()), 0);

const calculateEndTime = (duration: number, unit: TimeUnit) =>
  moment().add(duration, unit).add(10, "milliseconds");

const useTimer = ({
  duration = 15,
  unit = "minutes",
  refreshTime = 33,
  onTimerEnd = () => {},
}: Partial<UseTimerOptions>): UseTimerReturn => {
  const timerInterval = useRef<NodeJS.Timeout>();

  const onTimerEndCallback = useRef(onTimerEnd);

  const [state, setState] = useState<TimerState>(() => {
    const endTime = calculateEndTime(duration, unit);
    const maxTimeDiff = calculateTimeDiff(endTime);
    return {
      maxTimeDiff,
      endTime,
      isRunning: false,
      currentTimeDiff: maxTimeDiff,
    };
  });

  const { isRunning, maxTimeDiff, currentTimeDiff } = state;

  const setTimerEndCallback = useCallback(
    (callback: Callback) => (onTimerEndCallback.current = callback),
    []
  );

  const clearTimerInterval = useCallback(
    () => timerInterval.current && clearInterval(timerInterval.current),
    []
  );

  const setTimerInterval = useCallback(
    (callback: Callback) => {
      clearTimerInterval();
      timerInterval.current = setInterval(callback, refreshTime);
    },
    [refreshTime, clearTimerInterval]
  );

  const startTimer = useCallback(() => {
    if (!isRunning) {
      setState((state) => ({
        ...state,
        endTime: calculateEndTime(duration, unit),
      }));
      setTimerInterval(() => {
        setState((state) => {
          const diff = calculateTimeDiff(state.endTime);
          const shouldStop = diff <= 0;
          if (shouldStop) {
            clearTimerInterval();
            onTimerEndCallback.current();
          }
          return { ...state, currentTimeDiff: diff, isRunning: !shouldStop };
        });
      });
    }
  }, [isRunning, duration, unit, setTimerInterval, clearTimerInterval]);

  const stopTimer = useCallback(() => {
    clearTimerInterval();
    setState((state) => {
      const endTime = calculateEndTime(duration, unit);
      return {
        ...state,
        isRunning: false,
        endTime,
        currentTimeDiff: calculateTimeDiff(endTime),
      };
    });
  }, [duration, unit, clearTimerInterval]);

  const resetTimer = () => {
    setState((state) => {
      const endTime = calculateEndTime(duration, unit);
      return {
        ...state,
        endTime,
        currentTimeDiff: calculateTimeDiff(endTime),
      };
    });
  };

  return {
    currentTimeDiff,
    startTimer,
    stopTimer,
    setTimerEndCallback,
    isRunning,
    maxTimeDiff,
    resetTimer,
  };
};

export default useTimer;
