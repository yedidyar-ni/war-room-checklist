interface NotificationBannerProps {
  channelName: string;
}

export function NotificationBanner({ channelName }: NotificationBannerProps) {
  return (
    <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">
      {channelName}
    </span>
  );
}
