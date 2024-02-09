"use client";
import { AblyProvider } from "ably/react";
import * as Ably from "ably";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = new Ably.Realtime.Promise({
    authUrl: "/api/token",
    authMethod: "POST",
    clientId: Date.now().toString(),
  });
  return <AblyProvider client={client}>{children}</AblyProvider>;
}
