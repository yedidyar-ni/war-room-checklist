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
          title: "🚨 Is this a critical issue affecting multiple users?",
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
          title: "📞 Alert Management",
          checked: false,
          expanded: false,
          content: (
            <div className="mt-2 grid gap-2">
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  toast.success("Emergency Alert Sent");
                  logEvent("Sent emergency alert to all channels");
                  // This could trigger multiple notifications at once
                  sendSlackMessage("war-room", "Critical incident declared");
                }}
              >
                🚨 ALERT ALL CHANNELS
              </Button>
              <div className="text-sm text-gray-600 mt-1">
                This will notify: Team Lead, Group Lead, and War Room
              </div>
            </div>
          ),
        },
        {
          id: "3",
          title: "🎥 Start Emergency Meeting",
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
          title: "📢 Status Updates",
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
                  // This could broadcast to all relevant channels at once
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
          title: "🚀 Emergency Deploy",
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
    }
  }, [checklistItems.length, setChecklistItems, logEvent]);

  const handleCheck = (id: string) => {
    setChecklistItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    const item = checklistItems.find((item) => item.id === id);
    if (item) {
      logEvent(
        `${item.checked ? "Reopened" : "Completed"} checklist item: ${
          item.title
        }`
      );
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
    <main className="min-h-screen p-4 md:p-12 max-w-2xl mx-auto">
      <h1 className="text-2xl text-center font-bold mb-6 text-red-600">
        🚨 War Room: {decodeURIComponent(formattedDescription)}
      </h1>

      <div className="bg-red-50 p-4 rounded-lg mb-6 text-center text-sm">
        <p className="font-medium">
          Remember: Stay calm and follow the checklist
        </p>
        <p className="text-gray-600">Each step will be automatically logged</p>
      </div>

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
