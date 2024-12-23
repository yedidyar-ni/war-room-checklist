import "./globals.css";
import { Quicksand } from "next/font/google";
import { WarRoomProvider } from "../contexts/WarRoomContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Quicksand({ subsets: ["latin"] });

export const metadata = {
  title: "War Room App",
  description: "Manage and log war room activities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WarRoomProvider>{children}</WarRoomProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
