'use client'
import { Tabs, Box } from '@radix-ui/themes'
import Deposit from './deposit';
import Withdraw from './withdraw';

export default function Transaction() {
  return (
    <Tabs.Root defaultValue="deposit">
      <Tabs.List>
        <Tabs.Trigger value="deposit">Deposit</Tabs.Trigger>
        <Tabs.Trigger value="withdraw">Withdraw</Tabs.Trigger>
      </Tabs.List>

      <Box px="4" pt="3" pb="2">
        <Tabs.Content value="deposit">
          <Deposit />
        </Tabs.Content>

        <Tabs.Content value="withdraw">
          <Withdraw />
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  )
}