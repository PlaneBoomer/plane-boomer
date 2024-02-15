import React from "react";
import Link from "next/link";
import { Heading } from "@radix-ui/themes";
import { SITE_NAME } from "@/lib/const";
import { ConnectButton } from "../connect-button";

export function Header() {
  return (
    <header className='navbar flex justify-between p-4 pt-2'>
      <Link href='/'>
        <Heading>{SITE_NAME}</Heading>
      </Link>
      <ConnectButton />
    </header>
  );
}