"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

export interface LogEvent {
  dateTime: string;
  description: string;
  createdBy: "user" | "system";
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
  addEvent: (event: LogEvent) => void;
  removeEvent: (dateTime: string) => void;
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

  const logEvent = useCallback(
    (eventDescription: string, createdBy: "user" | "system" = "system") => {
      const newEvent = {
        dateTime: new Date().toISOString(),
        description: eventDescription,
        createdBy,
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    },
    []
  );

  const addEvent = (event: LogEvent) => {
    setEvents((prevEvents) => {
      const newEvents = [...prevEvents, event];
      // Sort events by dateTime
      return newEvents.sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );
    });
  };

  const removeEvent = useCallback((dateTime: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.dateTime !== dateTime)
    );
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
        addEvent,
        removeEvent,
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
