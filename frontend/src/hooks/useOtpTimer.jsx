import { useCallback, useEffect, useState } from "react";

const useOtpTimer = (initialSeconds = 60) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const startTimer = useCallback(
    (seconds = initialSeconds) => {
      setTimeLeft(seconds);
    },
    [initialSeconds],
  );

  const resetTimer = useCallback(() => {
    setTimeLeft(0);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      return undefined;
    }

    const interval = setInterval(() => {
      setTimeLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const expired = timeLeft <= 0;

  return {
    timeLeft,
    expired,
    startTimer,
    resetTimer,
  };
};

export default useOtpTimer;
