"use client";
import React, { PropsWithChildren, useEffect } from "react";
import { Header } from "../header";
import { useAccount } from "wagmi";
import { useAuth } from "@/context/auth";

export function Layout(props: PropsWithChildren) {
  const { login } = useAuth();
  const { isConnected } = useAccount();
  useEffect(() => {
    if (isConnected) {
      login();
    }
  }, [isConnected])
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow px-4 container mx-auto">{props.children}</main>
    </div>
  );
}
