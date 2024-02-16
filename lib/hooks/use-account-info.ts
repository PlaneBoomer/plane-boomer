import { useAccount, useReadContract, useBalance } from "wagmi";
import type { Address } from "@/types/web3";
import { PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS } from "@/lib/const/contract";
import abis from "@/abis/planeBoomer.json";
import { useMemo } from "react";

const to: Address = PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS;

export const useAccountInfo = () => {
  const { address, isConnected } = useAccount();
  const { data: chipsAmount } = useReadContract({
    address: to,
    abi: abis,
    functionName: "balanceOf",
    args: [address],
  });
  const accountInfo = useMemo(
    () => ({
      address,
      isConnected,
      chipsAmount: (chipsAmount as number) || 100,
    }),
    [address, isConnected, chipsAmount]
  );
  return accountInfo;
};
