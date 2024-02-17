"use client";

import { Heading, Flex, Button, Text } from "@radix-ui/themes";
import Transaction from "./transaction";
import { Grid } from "@radix-ui/themes";
import { useAccount } from "wagmi";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

function Introdcution() {
  return (
    <Flex direction="column">
      <Heading as="h3" size="8" className="mb-2">Welcome to Plane Boomer</Heading>
      <Text as="p" size="5" className="leading-6">
        Plane Boomer is a captivating game meant for enjoyment with friends, blending strategy and luck seamlessly.
        The objective is to strategically dismantle the opponent&apos;s target plane, aiming to be the first player to achieve this feat.
        Upon victory, you&apos;ll also claim the opponent&apos;s chips as your reward.
        <br /><br />
        Plane Boomer will utilize Blast&apos;s gas returns as funding for the maintenance of the project, with claimable yield serving as rewards for top-ranking players.</Text>
    </Flex>)
}

function StartGameButton() {
  const { isAuthenticated, login } = useAuth();
  const { isConnected } = useAccount();
  const router = useRouter();

  if (!isConnected) {
    return <Button size="4" disabled>Connect Wallet to Start Game</Button>
  }
  
  const onClick = isAuthenticated ? () => router.push("/rooms") : async () => {
    const result = await login();
    if (result.success) {
      router.push("/rooms");
    }
  };

  return <Button size="4" onClick={onClick} >Start Game</Button>
}

export default function Home() {
  return (<Grid columns="2" gap="6" width="auto" className="mt-12">
    <Flex direction="column" gap="6">
      <Introdcution />
      <div>
        <StartGameButton />
      </div>
    </Flex>
    <Transaction />
  </Grid>)
}
