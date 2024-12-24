import { useState, useEffect } from "react";

interface UseCountdownTimerProps {
  initialTime: number;
  onComplete?: () => void;
}

export function useCountdownTimer({
  initialTime,
  onComplete,
}: UseCountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          onComplete?.();
          return initialTime;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialTime, onComplete]);

  const resetTimer = () => setTimeLeft(initialTime);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return {
    timeLeft,
    resetTimer,
    formattedTime: formatTime(timeLeft),
  };
}
