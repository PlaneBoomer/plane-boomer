import { useAccount, useReadContract, useBalance } from "wagmi";
import type { Address } from "@/types/web3";
import { PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS } from "@/lib/const/contract";
import abis from "@/abis/planeBoomer.json";
import { useMemo } from "react";
import { useAuth } from "@/context/auth";

const to: Address = PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS;

export const useAccountInfo = () => {
  const { address, isConnected } = useAccount();
  const { isAuthenticated, login } = useAuth();
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
      isAuthenticated,
      login,
      chipsAmount: (chipsAmount as number) || 0,
    }),
    [address, isConnected, chipsAmount, isAuthenticated, login]
  );
  return accountInfo;
};
