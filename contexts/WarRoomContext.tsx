"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface LogEvent {
  dateTime: string;
  description: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  checked: boolean;
  expanded: boolean;
  content: React.ReactNode;
}

interface WarRoomContextType {
  title: string;
  setTitle: (title: string) => void;
  formattedDescription: string;
  logEvent: (description: string) => void;
  events: LogEvent[];
  checklistItems: ChecklistItem[];
  setChecklistItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  isWarRoomOpen: boolean;
  setIsWarRoomOpen: (isOpen: boolean) => void;
}

const WarRoomContext = createContext<WarRoomContextType | undefined>(undefined);

export function WarRoomProvider({ children }: { children: ReactNode }) {
  const [title, setTitleState] = useState("");
  const [events, setEvents] = useState<LogEvent[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isWarRoomOpen, setIsWarRoomOpen] = useState(false);

  const setTitle = useCallback((newTitle: string) => {
    setTitleState(newTitle);
  }, []);

  const formattedDescription = encodeURIComponent(title);

  const logEvent = useCallback((eventDescription: string) => {
    const newEvent = {
      dateTime: new Date().toISOString(),
      description: eventDescription,
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  }, []);

  return (
    <WarRoomContext.Provider
      value={{
        title,
        setTitle,
        formattedDescription,
        logEvent,
        events,
        checklistItems,
        setChecklistItems,
        isWarRoomOpen,
        setIsWarRoomOpen,
      }}
    >
      {children}
    </WarRoomContext.Provider>
  );
}

export function useWarRoom() {
  const context = useContext(WarRoomContext);
  if (context === undefined) {
    throw new Error("useWarRoom must be used within a WarRoomProvider");
  }
  return context;
}
