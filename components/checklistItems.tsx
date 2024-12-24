import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StatusUpdate } from "@/components/StatusUpdate";

export const createChecklistItems = (logEvent: (event: string) => void) => [
  {
    id: "1",
    title: "Assess Tools",
    checked: false,
    expanded: false,
    content: (
      <div className="grid gap-3 mt-2">
        <div className="text-sm text-gray-600 mb-1">
          Quick access to critical monitoring tools:
        </div>
        {[
          {
            name: "Purchase Flow Monitoring Dashboard",
            url: "https://systemhealth.yourdomain.com",
          },
          {
            name: "System Health",
            url: "https://app.datadoghq.com/dashboard",
          },
          { name: "AWS Status Page", url: "https://grafana.yourdomain.com" },
          {
            name: "Stripe Status Page",
            url: "https://kibana.yourdomain.com",
          },
          { name: "Check if Robin Available", url: "https://newrelic.com/apm" },
          {
            name: "Check if Public Site Available",
            url: "https://newrelic.com/apm",
          },
        ].map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors text-blue-600 hover:text-blue-800"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            {tool.name}
          </a>
        ))}
      </div>
    ),
  },
  {
    id: "2",
    title: "Alert Management",
    checked: false,
    expanded: false,
    content: (
      <div className="space-y-4">
        <Button
          variant="destructive"
          onClick={() => {
            toast("Calling Engineering Group Lead at +1-111-222-3333");
          }}
          className="text-wrap p-8"
        >
          Involve an engineering group lead: Call the Critical Incident Response
          Phone +1-111-222-3333 (select 2) or reachout to them directly (Phone,
          Whatsapp)
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            toast("Calling Platform Engineering Support at +1-444-555-6666");
          }}
          className="text-wrap p-8"
        >
          If you require Platform Engineering: Call the Critical Incident
          Response Phone +1-444-555-6666 (select 3)
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            toast("Opening team contact directory...");
          }}
          className="text-wrap p-8"
        >
          If you have identified the owner of the issue, ask for the Team Lead
          or the Service team members to join
        </Button>
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
