"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWarRoom } from "@/contexts/WarRoomContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createChecklistItems } from "@/app/data/checklistItems";

export default function Home() {
  const { title, setTitle, logEvent, setIsWarRoomOpen, setChecklistItems } =
    useWarRoom();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsWarRoomOpen(true);
    logEvent(`Opened war room: ${title}`);

    setChecklistItems(createChecklistItems(logEvent));
    router.push("/checklist");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <Card className="border border-gray-200 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl text-center text-gray-800">
              Open War Room
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Coordinate incident response and team collaboration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    Incident Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g., API Gateway Service Degradation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                    required
                    aria-required="true"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 h-12"
                  disabled={isLoading || !title.trim()}
                  aria-label={
                    isLoading ? "Opening war room..." : "Open war room"
                  }
                >
                  {isLoading ? (
                    <span
                      className="flex items-center justify-center gap-2"
                      role="status"
                    >
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      <span>Initializing War Room...</span>
                    </span>
                  ) : (
                    "Open War Room"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Pro tip:</strong> When you open a War Room, emergency
            communication channels will be activated
          </p>
        </div>
      </div>
    </main>
  );
}
