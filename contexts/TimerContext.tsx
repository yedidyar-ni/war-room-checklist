import { createContext, useContext, ReactNode } from "react";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
interface TimerContextType {
  formattedTime: string;
  resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({
  children,
  onComplete,
}: {
  children: ReactNode;
  onComplete: () => void;
}) {
  const timerState = useCountdownTimer({
    initialTime: 30 * 60,
    onComplete,
  });

  return (
    <TimerContext.Provider value={timerState}>{children}</TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
