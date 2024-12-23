"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useWarRoom } from "@/contexts/WarRoomContext";
import { sendSlackMessage } from "@/utils/slack";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function Checklist() {
  const router = useRouter();
  const {
    description,
    formattedDescription,
    logEvent,
    checklistItems,
    setChecklistItems,
    isWarRoomOpen,
  } = useWarRoom();

  useEffect(() => {
    if (!isWarRoomOpen) {
      router.push("/");
    }
  }, [isWarRoomOpen, router]);

  useEffect(() => {
    if (checklistItems.length === 0) {
      setChecklistItems([
        {
          id: "1",
          title: "Determine if a war room is needed",
          checked: false,
          expanded: false,
          content: (
            <p className="mt-2 text-sm text-gray-600">
              {`A war room should be opened when there's a critical issue
              affecting multiple users or core functionality of the system.`}
            </p>
          ),
        },
        {
          id: "2",
          title: "Notify A manager",
          checked: false,
          expanded: false,
          content: (
            <div className="mt-2 space-y-3">
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => {
                  console.log("toast");

                  toast("Team Lead Notified");
                  logEvent("Notified Team Lead for low-severity issue");
                }}
              >
                Notify Team Lead
              </Button>

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  toast("Calling Group Lead");
                  logEvent("Initiated PagerDuty call to Group Lead");
                }}
              >
                Call Group Lead (PagerDuty)
              </Button>

              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => {
                  toast("SMS Sent");
                  logEvent("Sent SMS to Group Lead PagerDuty");
                }}
              >
                SMS Group Lead
              </Button>

              <p className="text-xs text-gray-500 text-center">
                PagerDuty: 1800132213311
              </p>
            </div>
          ),
        },
        {
          id: "3",
          title: "Start a Zoom",
          checked: false,
          expanded: false,
          content: (
            <div className="mt-2 space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  toast("Starting Zoom Meeting");
                  logEvent("Started new Zoom meeting");
                }}
              >
                Start New Zoom Meeting
              </Button>

              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const meetingId = prompt("Enter Zoom meeting ID:");
                  if (meetingId) {
                    toast("Joined Zoom Meeting");
                    logEvent(`Joined Zoom meeting: ${meetingId}`);
                  }
                }}
              >
                Join Existing Meeting
              </Button>

              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  toast("Team Notified");
                  logEvent(`Notified Issue In Prod Room: ${description}`);
                }}
              >
                Notify Team (Slack)
              </Button>
            </div>
          ),
        },
        {
          id: "4",
          title: "Fast deploy to Resolve issue - if needed",
          checked: false,
          expanded: false,
          content: (
            <div className="mt-2 space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  const jenkinsUrl =
                    "https://jenkins.example.com/job/emergency-deploy/123";
                  toast.success("Pipeline triggered successfully!", {
                    description: (
                      <Link
                        href={jenkinsUrl}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                      >
                        View build progress: {jenkinsUrl}
                      </Link>
                    ),
                  });
                  logEvent("Triggered emergency deployment pipeline");
                }}
              >
                Trigger Emergency Deploy Pipeline
              </Button>

              <div className="text-sm text-gray-500 mt-2">
                ⚠️ Only use for critical fixes that have been properly tested
              </div>
            </div>
          ),
        },
        {
          id: "5",
          title: "Post Update messages to channels",
          checked: false,
          expanded: false,
          content: (
            <div className="mt-2 space-y-2">
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Enter update message"
              ></textarea>
              <div className="flex space-x-2">
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    sendSlackMessage("war-room", "Update message");
                    logEvent("Published update to War Room");
                    toast.success("Message sent to War Room channel", {
                      description:
                        "Your update has been published successfully",
                    });
                  }}
                >
                  Publish to War Room
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    sendSlackMessage("a-team", "Update message");
                    logEvent("Updated A-Team Channel");
                    toast.success("Message sent to A-Team channel", {
                      description:
                        "Your update has been published successfully",
                    });
                  }}
                >
                  A-Team Update Channel
                </Button>
              </div>
            </div>
          ),
        },
      ]);
    }
  }, [checklistItems.length, setChecklistItems, description, logEvent]);

  const handleCheck = (id: string) => {
    setChecklistItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    const item = checklistItems.find((item) => item.id === id);
    if (item) {
      logEvent(`${item.checked ? "Unchecked" : "Checked"} item: ${item.title}`);
    }
  };

  const handleCloseWarRoom = async () => {
    await sendSlackMessage("war-room-channel", "War room closed");
    logEvent("War room closed");
    toast.success("War Room closed", {
      description:
        "All actions have been logged and the war room has been closed",
    });
    router.push("/logger");
  };

  const allChecked = checklistItems.every((item) => item.checked);

  return (
    <main className="min-h-screen p-6 md:p-24 max-w-4xl mx-auto">
      <h1 className="text-lg text-center font-medium mb-8 border-b pb-4">
        War Room: {decodeURIComponent(formattedDescription)}
      </h1>

      <Accordion type="multiple" className="space-y-2">
        {checklistItems.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className={`border rounded-lg shadow-sm ${
              item.checked ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="flex items-center px-4 py-2 gap-3">
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => handleCheck(item.id)}
                disabled={item.checked}
                className="h-5 w-5"
              />
              <AccordionTrigger className="hover:no-underline py-2">
                <span
                  className={`${
                    item.checked
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {item.title}
                </span>
              </AccordionTrigger>
            </div>
            <Separator />
            <AccordionContent className="px-4 py-3">
              {item.id === "5" ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter update message"
                    className="min-h-[100px]"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        sendSlackMessage("war-room", "Update message");
                        logEvent("Published update to War Room");
                        toast.success("Message sent to War Room channel", {
                          description:
                            "Your update has been published successfully",
                        });
                      }}
                    >
                      Publish to War Room
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        sendSlackMessage("a-team", "Update message");
                        logEvent("Updated A-Team Channel");
                        toast.success("Message sent to A-Team channel", {
                          description:
                            "Your update has been published successfully",
                        });
                      }}
                    >
                      A-Team Update Channel
                    </Button>
                  </div>
                </div>
              ) : (
                item.content
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="mt-8 border-green-200 bg-green-50">
              <CardContent className="pt-6 space-y-4">
                <Button
                  onClick={handleCloseWarRoom}
                  className="w-full"
                  variant="default"
                  disabled={!allChecked}
                >
                  Close War Room
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  Move to the logger page and copy the logged process to start
                  writing the retro
                </p>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Complete all checklist items to close the war room</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="fixed bottom-6 right-6">
        <Link href="/logger">
          <Button variant="outline" className="shadow-lg">
            View Logger
          </Button>
        </Link>
      </div>
    </main>
  );
}
