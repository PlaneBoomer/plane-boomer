"use client";
import { useAccountInfo } from "@/lib/hooks/use-account-info";
import { AblyClientProvider } from "@/context/ably-client-provider";

interface Props {
  params: {
    roomID: string;
  };
  children: React.ReactNode;
}

export default function RoomLayout({ params: { roomID }, children }: Props) {
  const account = useAccountInfo();
  return (
    <AblyClientProvider clientID={account.address}>
      {children}
    </AblyClientProvider>
  );
}
