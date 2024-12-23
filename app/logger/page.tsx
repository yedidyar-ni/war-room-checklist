"use client";

import { useWarRoom } from "@/contexts/WarRoomContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Logger() {
  const { formattedDescription, events, isWarRoomOpen } = useWarRoom();

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleCopyEvents = () => {
    const eventText = events
      .map((event) => `${formatTime(event.dateTime)} - ${event.description}`)
      .join("\n");
    navigator.clipboard
      .writeText(eventText)
      .then(() => alert("Events copied to clipboard"))
      .catch((err) => console.error("Failed to copy events: ", err));
  };

  return (
    <main className="min-h-screen p-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          War Room Logger: {decodeURIComponent(formattedDescription)}
        </h1>
        <Link href={isWarRoomOpen ? "/checklist" : "/"}>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            {isWarRoomOpen ? "Return to Checklist" : "Return to Home"}
          </Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 w-1/3">Time</th>
              <th className="border p-2 w-2/3">Description</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index}>
                <td className="border p-2">{formatTime(event.dateTime)}</td>
                <td className="border p-2">{event.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="fixed bottom-8 right-8">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleCopyEvents}
        >
          Copy All Events
        </Button>
      </div>
    </main>
  );
}
