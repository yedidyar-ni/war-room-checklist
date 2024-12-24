import { useTimer } from "@/contexts/TimerContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";

interface StatusUpdateProps {
  logEvent: (event: string) => void;
}

const CANNED_MESSAGES = {
  investigating: "🔍 We are investigating the issue. More updates to follow.",
  identified: "✓ Root cause identified. Engineering team is working on a fix.",
  mitigating: "⚡ Mitigation in progress. ETA for resolution: ~XX minutes.",
  resolved: "✅ Issue has been resolved. Services are back to normal.",
};

const CHANNELS = [
  {
    id: "war_room",
    name: "#prod_issue_war_room",
    className: "bg-red-500 hover:bg-red-600",
  },
  {
    id: "outage",
    name: "#production-outage-updates",
    className: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    id: "media",
    name: "#media_buying_shutdown",
    className: "bg-blue-500 hover:bg-blue-600",
  },
];

export function StatusUpdate({ logEvent }: StatusUpdateProps) {
  const { formattedTime, resetTimer } = useTimer();
  const [updateText, setUpdateText] = useState("");

  const handleBroadcast = (channelName: string) => {
    if (!updateText.trim()) {
      toast.error("Please enter a status update");
      return;
    }
    toast.success(`Update broadcast to ${channelName}`);
    logEvent(`Broadcast status update to ${channelName}`);
    resetTimer();
  };

  const insertCannedMessage = (message: string) => {
    setUpdateText(message);
  };

  return (
    <div className="mt-2 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-gray-600">
          Next automatic update in: {formattedTime}
        </div>
      </div>

      {/* Canned Messages */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(CANNED_MESSAGES).map(([key, message]) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            onClick={() => insertCannedMessage(message)}
            className="text-xs h-7 px-2"
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Button>
        ))}
      </div>

      <Textarea
        className="w-full p-2 border rounded min-h-[80px]"
        placeholder="Type status update here..."
        rows={3}
        value={updateText}
        onChange={(e) => setUpdateText(e.target.value)}
      />

      {/* Channel Buttons */}
      <div className="flex gap-2">
        {CHANNELS.map((channel) => (
          <Button
            key={channel.id}
            className={`flex-1 text-white ${channel.className} h-8 text-sm`}
            onClick={() => handleBroadcast(channel.name)}
          >
            {channel.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
