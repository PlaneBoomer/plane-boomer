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
        // 临时解决方案，等待账户加载完成后再登录
        setTimeout(() => { login(); }, 1000);
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