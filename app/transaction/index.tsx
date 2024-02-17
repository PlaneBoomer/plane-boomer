"use client";
import { Tabs, Box, Flex } from "@radix-ui/themes";
import Deposit from "./deposit";
import Withdraw from "./withdraw";
import "./style.css";

export default function Transaction() {
  return (
    <Flex justify="center">
      <Tabs.Root className="TabsRoot" defaultValue="deposit">
        <Tabs.List className="TabsList">
          <Tabs.Trigger className="TabsTrigger" value="deposit">Deposit</Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="withdraw">Withdraw</Tabs.Trigger>
        </Tabs.List>

        <Box px="4" pb="2">
          <Tabs.Content className="TabsContent" value="deposit">
            <Deposit />
          </Tabs.Content>

          <Tabs.Content className="TabsContent" value="withdraw">
            <Withdraw />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Flex>
  );
}