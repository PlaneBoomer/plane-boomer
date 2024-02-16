"use client";
import React, { PropsWithChildren } from "react";
import { Header } from "../header";
import { useAccountEffect } from "wagmi";
import { useAuth } from "@/context/auth";

export function Layout(props: PropsWithChildren) {
  const { login } = useAuth();

  useAccountEffect(
    {
      onConnect: () => {
        login();
      }
    }
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow px-4 container mx-auto">{props.children}</main>
    </div>
  );
}