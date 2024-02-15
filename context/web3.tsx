"use client";

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { PropsWithChildren } from 'react'
import { State, WagmiProvider } from 'wagmi'
import { WALLETCONNECT_CONFIG, WALLETCONNECT_PROJECT_ID } from '@/lib/const/web3'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

interface Props extends PropsWithChildren {
  initialState?: State
}

createWeb3Modal({
  wagmiConfig: WALLETCONNECT_CONFIG,
  projectId: WALLETCONNECT_PROJECT_ID,
  enableAnalytics: false,
  themeMode: "light"
})

const queryClient = new QueryClient()

export function Web3Provider(props: Props) {
  return (
    <WagmiProvider config={WALLETCONNECT_CONFIG} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}