"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { Copy, ArrowLeft, Trash2 } from "lucide-react";
import { LogEvent, useWarRoom } from "@/contexts/WarRoomContext";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DateTimePicker } from "@/components/ui/time-picker";

export default function Logger() {
  const { formattedDescription, events, isWarRoomOpen, addEvent, removeEvent } =
    useWarRoom();
  const [newLog, setNewLog] = useState("");
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleCopyEvents = async () => {
    try {
      const eventText = events
        .map((event) => `${formatTime(event.dateTime)} - ${event.description}`)
        .join("\n");
      await navigator.clipboard.writeText(eventText);
      toast.success("Events copied to clipboard");
    } catch (err) {
      console.error("Failed to copy events: ", err);
      toast.error("Failed to copy events to clipboard");
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.trim()) return;

    addEvent({
      dateTime: selectedTime.toISOString(),
      description: newLog.trim(),
      createdBy: "user",
    });
    setNewLog("");
    setSelectedTime(new Date());
    toast.success("Log added successfully");
  };

  const handleRemoveEvent = (event: LogEvent) => {
    if (event.createdBy !== "user") {
      toast.error("Cannot remove system-generated events");
      return;
    }
    removeEvent(event.dateTime);
    toast.success("Event removed successfully");
  };

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Link href={isWarRoomOpen ? "/checklist" : "/"}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold">
              War Room View Audit Log :{" "}
              {decodeURIComponent(formattedDescription)}
            </h1>
          </div>

          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleCopyEvents}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </div>

        <div className="mb-6">
          <form onSubmit={handleAddLog} className="flex gap-2">
            <DateTimePicker date={selectedTime} setDate={setSelectedTime} />
            <Input
              type="text"
              placeholder="Add new log entry..."
              value={newLog}
              onChange={(e) => setNewLog(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={newLog.trim() === ""}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Add Log
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b px-6 py-3 text-left text-sm font-semibold text-gray-900 w-1/4">
                    Time
                  </th>
                  <th className="border-b px-6 py-3 text-left text-sm font-semibold text-gray-900 w-3/4">
                    Description
                  </th>
                  <th className="border-b px-6 py-3 text-left text-sm font-semibold text-gray-900 w-16">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatTime(event.dateTime)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {event.description}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {event.createdBy === "user" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            handleRemoveEvent(event);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
