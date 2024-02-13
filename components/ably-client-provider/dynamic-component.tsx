"use client";
import { AblyProvider } from "ably/react";
import { Realtime } from "ably/promises";
import { useMemo } from "react";

interface Props {
  clientID?: string;
  children: React.ReactNode;
}

export default function AblyClientProvider({ children, clientID }: Props) {
  const client = useMemo(
    () =>
      new Realtime.Promise({
        authUrl: "/api/ably-token",
        authMethod: "POST",
        clientId: clientID || "onLooker",
      }),
    [clientID]
  );
  return <AblyProvider client={client}>{children}</AblyProvider>;
}
