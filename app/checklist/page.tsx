"use client";

import { useEffect, useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { TimerProvider } from "@/app/contexts/TimerContext";

export default function Checklist() {
  const router = useRouter();
  const {
    formattedDescription,
    logEvent,
    checklistItems,
    setChecklistItems,
    isWarRoomOpen,
  } = useWarRoom();

  const [isLoading, setIsLoading] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>(
    checklistItems.at(0) ? [checklistItems.at(0)!.id] : []
  );

  useEffect(() => {
    if (!isWarRoomOpen) {
      router.push("/");
    }
  }, [isWarRoomOpen, router]);

  const handleCheck = (id: string) => {
    setChecklistItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );

      const currentItem = prevItems.find((item) => item.id === id);
      if (currentItem && !currentItem.checked) {
        const currentIndex = prevItems.findIndex((item) => item.id === id);
        const nextItem = prevItems
          .slice(currentIndex + 1)
          .find((item) => !item.checked);

        if (nextItem) {
          setOpenItems((prev) => {
            const newItems = prev.filter((item) => item !== id);
            return [...newItems, nextItem.id];
          });
        }
      }

      return updatedItems;
    });

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
    try {
      setIsLoading(true);
      await sendSlackMessage("war-room-channel", "War room closed");
      logEvent("War room closed");
      toast.success("War Room closed", {
        description:
          "All actions have been logged and the war room has been closed",
      });
      router.push("/logger");
    } catch (error) {
      console.error(error);
      toast.error("Failed to close war room");
    } finally {
      setIsLoading(false);
    }
  };

  const allChecked = checklistItems.every((item) => item.checked);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "l") {
        event.preventDefault();
        router.push("/logger");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  const handleTimerComplete = () => {
    toast.success("Update broadcast to all channels");
    // Add any other timer completion logic here
  };

  return (
    <TimerProvider onComplete={handleTimerComplete}>
      <main className="min-h-screen p-4 md:p-12 max-w-2xl mx-auto">
        <h1 className="text-2xl text-center font-bold mb-6 text-gray-800">
          Incident Response: {decodeURIComponent(formattedDescription)}
        </h1>

        <Accordion
          type="multiple"
          className="space-y-2"
          value={openItems}
          onValueChange={setOpenItems}
        >
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
                {item.content}
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
                    disabled={!allChecked || isLoading}
                  >
                    {isLoading ? "Closing..." : "Close War Room"}
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
              View Audit Log
            </Button>
          </Link>
        </div>
      </main>
    </TimerProvider>
  );
}
