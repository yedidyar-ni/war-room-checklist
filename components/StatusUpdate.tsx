import { useTimer } from "@/contexts/TimerContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface StatusUpdateProps {
  logEvent: (event: string) => void;
}

export function StatusUpdate({ logEvent }: StatusUpdateProps) {
  const { formattedTime, resetTimer } = useTimer();

  const handleBroadcast = () => {
    toast.success("Update broadcast to all channels");
    logEvent("Broadcast status update");
    resetTimer();
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-bold text-gray-600">
          Next automatic update in: {formattedTime}
        </div>
      </div>
      <Textarea
        className="w-full p-2 border rounded"
        placeholder="Type status update here..."
        rows={3}
      />
      <Button
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
        onClick={handleBroadcast}
      >
        Broadcast Update to All Channels
      </Button>
    </div>
  );
}
