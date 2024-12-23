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
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              <li>Notify Team Lead for low-severity issues.</li>
              <li>Notify Group Lead - pager duty 1800132213311</li>
            </ul>
          ),
        },
        {
          id: "3",
          title: "Start a Zoom",
          checked: false,
          expanded: false,
          content: (
            <Button
              className="mt-2 bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                sendSlackMessage(
                  "prod-issues",
                  `A new war room is opened, with ${description}, we will update after we assess the issue`
                );
                logEvent(`Notified Issue In Prod Room: ${description}`);
              }}
            >
              Notify Issue In Prod Room
            </Button>
          ),
        },
        {
          id: "4",
          title: "Fast deploy to Resolve issue - if needed",
          checked: false,
          expanded: false,
          content: (
            <div className="mt-2 space-y-2">
              <Link href="#" className="text-blue-600 hover:underline block">
                Jenkins Build 1
              </Link>
              <Link href="#" className="text-blue-600 hover:underline block">
                Jenkins Build 2
              </Link>
              <Link href="#" className="text-blue-600 hover:underline block">
                Jenkins Build 3
              </Link>
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
                  }}
                >
                  Publish to War Room
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    sendSlackMessage("a-team", "Update message");
                    logEvent("Updated A-Team Channel");
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
    router.push("/logger");
  };

  const allChecked = checklistItems.every((item) => item.checked);

  return (
    <main className="min-h-screen p-6 md:p-24 max-w-4xl mx-auto">
      <Card className="mb-8 bg-red-50">
        <CardContent className="pt-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-lg font-medium">
            War Room: {decodeURIComponent(formattedDescription)}
          </p>
        </CardContent>
      </Card>

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
                      }}
                    >
                      Publish to War Room
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        sendSlackMessage("a-team", "Update message");
                        logEvent("Updated A-Team Channel");
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
