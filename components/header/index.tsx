import React from "react";
import Link from "next/link";
import { Heading } from "@radix-ui/themes";
import { SITE_NAME } from "@/lib/const";
import { ConnectButton } from "../connect-button";

export function Header() {
  return (
    <header className='flex justify-between p-4 container'>
      <Link href='/'>
        <Heading size="7">{SITE_NAME} 💥</Heading>
      </Link>
      <ConnectButton />
    </header>
  );
}