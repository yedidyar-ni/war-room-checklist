"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWarRoom } from "@/contexts/WarRoomContext";
import { sendSlackMessage } from "@/utils/slack";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const { title, setTitle, logEvent, setIsWarRoomOpen, setChecklistItems } =
    useWarRoom();
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsWarRoomOpen(true);
    logEvent(`Opened war room: ${title}`);
    await sendSlackMessage(
      "war-room-channel",
      `New war room opened:\nTitle: ${title}\nDescription: ${description}`
    );

    setChecklistItems([
      {
        id: "1",
        title: "Is this a critical issue affecting multiple users?",
        checked: false,
        expanded: false,
        content: (
          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white mt-2"
            onClick={() => {
              toast.success("War Room initiated");
              logEvent("Confirmed critical issue status");
            }}
          >
            Yes - Continue with War Room
          </Button>
        ),
      },
      {
        id: "2",
        title: "Alert Management",
        checked: false,
        expanded: false,
        content: (
          <div className="mt-2 grid gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                  ALERT ALL CHANNELS
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will send emergency alerts to all channels and notify
                    all team members.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      toast.success("Emergency Alert Sent");
                      logEvent("Sent emergency alert to all channels");
                      sendSlackMessage(
                        "war-room",
                        "Critical incident declared"
                      );
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="text-sm text-gray-600 mt-1">
              This will notify: Team Lead, Group Lead, and War Room
            </div>
          </div>
        ),
      },
      {
        id: "3",
        title: "Start Emergency Meeting",
        checked: false,
        expanded: false,
        content: (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
            onClick={() => {
              toast.success("Emergency Zoom Started");
              logEvent("Started emergency Zoom meeting");
              // This could automatically start a Zoom and share the link
            }}
          >
            Start & Share Emergency Zoom Link
          </Button>
        ),
      },
      {
        id: "4",
        title: "Status Updates",
        checked: false,
        expanded: false,
        content: (
          <div className="mt-2 space-y-2">
            <Textarea
              className="w-full p-2 border rounded"
              placeholder="Type status update here..."
              rows={3}
            />
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={() => {
                toast.success("Update broadcast to all channels");
                logEvent("Broadcast status update");
              }}
            >
              Broadcast Update to All Channels
            </Button>
          </div>
        ),
      },
      {
        id: "5",
        title: "Emergency Deploy",
        checked: false,
        expanded: false,
        content: (
          <div className="mt-2">
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                toast.success("Emergency deployment initiated");
                logEvent("Started emergency deployment");
              }}
            >
              Start Emergency Deploy
            </Button>
          </div>
        ),
      },
    ]);
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
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    Detailed Description{" "}
                    <span className="text-gray-500">(optional)</span>
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the incident, impact, and any relevant details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[100px] resize-y"
                    aria-required="false"
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

        <Card className="border border-gray-200 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600" role="list">
              <li className="flex items-center gap-2">
                <span className="text-blue-500" aria-hidden="true">
                  •
                </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500" aria-hidden="true">
                  •
                </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500" aria-hidden="true">
                  •
                </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
