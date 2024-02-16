"use client";
import { AblyClientProvider } from "@/context/ably-client-provider";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AblyClientProvider>{children}</AblyClientProvider>;
}
