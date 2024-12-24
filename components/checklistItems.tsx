import { Button } from "@/components/ui/button";
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
import { StatusUpdate } from "@/components/StatusUpdate";

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
      <div className="mt-2 grid gap-4">
        <div className="flex flex-row gap-2 justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                ALERT ALL CHANNELS
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Alert All Channels?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will send emergency alerts to all communication channels.
                  Make sure this is a critical incident that requires full team
                  awareness.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    toast.success("Emergency Alert Sent to All Channels");
                    logEvent("Sent emergency alert to all channels");
                    sendSlackMessage("war-room", "Critical incident declared");
                  }}
                >
                  Send Alerts
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                CALL PAGER DUTY
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Trigger PagerDuty Alert?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will initiate emergency on-call notifications through
                  PagerDuty. All on-call engineers will be paged.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    toast.success("PagerDuty Alert Triggered");
                    logEvent("Triggered PagerDuty emergency alert");
                    // Add PagerDuty integration call here if needed
                  }}
                >
                  Trigger PagerDuty
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
