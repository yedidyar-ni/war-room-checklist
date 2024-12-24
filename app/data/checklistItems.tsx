import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { sendSlackMessage } from "@/utils/slack";
import { useEffect, useState } from "react";

export const createChecklistItems = (logEvent: (event: string) => void) => [
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
                This will send emergency alerts to all channels and notify all
                team members.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  toast.success("Emergency Alert Sent");
                  logEvent("Sent emergency alert to all channels");
                  sendSlackMessage("war-room", "Critical incident declared");
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
    content: <StatusUpdate logEvent={logEvent} />,
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
];

function StatusUpdate({ logEvent }: { logEvent: (event: string) => void }) {
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    if (timeLeft <= 0) {
      toast.success("Update broadcast to all channels");
      logEvent("Broadcast status update");
      setTimeLeft(30 * 60);
    }
    return () => clearInterval(interval);
  }, [logEvent, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-bold text-gray-600">
          Next automatic update in: {formatTime(timeLeft)}
        </div>
      </div>
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
          setTimeLeft(30 * 60);
        }}
      >
        Broadcast Update to All Channels
      </Button>
    </div>
  );
}
