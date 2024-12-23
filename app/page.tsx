"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWarRoom } from "@/contexts/WarRoomContext";
import { sendSlackMessage } from "@/utils/slack";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const { description, setDescription, logEvent, setIsWarRoomOpen } =
    useWarRoom();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOpenWarRoom = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsWarRoomOpen(true);
    logEvent(`Opened war room: ${description}`);

    // Send message to Slack
    await sendSlackMessage(
      "war-room-channel",
      `New war room opened: ${description}`
    );

    // Navigate to checklist page
    router.push("/checklist");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">War Room Checklist</h1>
      <div className="w-full max-w-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Input
            type="text"
            placeholder="War room short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleOpenWarRoom}
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? "Opening..." : "Open War Room"}
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="guidance" className="border-none">
            <AccordionTrigger className="text-left hover:no-underline py-2">
              Not sure if you need a War Room?
            </AccordionTrigger>
            <AccordionContent className="pt-1">
              <div className="text-center border rounded-lg p-4 bg-gray-50">
                <p className="text-gray-600">Consider opening a War Room if:</p>
                <ul className="text-sm text-gray-600 mt-2 text-left list-disc pl-6">
                  <li>{`There's a critical production incident`}</li>
                  <li>{`Multiple teams need to coordinate`}</li>
                  <li>{`Customer-facing services are impacted`}</li>
                  <li>{`Immediate response is required`}</li>
                </ul>
                <a
                  href="#"
                  className="text-blue-500 hover:text-blue-600 text-sm mt-4 block"
                >
                  Learn more about War Room protocols →
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
}
