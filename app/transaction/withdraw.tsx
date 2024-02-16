"use client";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import { toast } from "sonner";
import * as Form from "@radix-ui/react-form";
import { PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS } from "@/lib/const/contract";
import type { Address } from "@/types/web3";
import { Text, TextField, Button, Strong, TextFieldRoot, Flex } from "@radix-ui/themes";
import abi from "@/abis/planeBoomer.json";
import { SITE_NAME } from "@/lib/const";
import "./style.css";

const to: Address = PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS;

export default function Withdraw() {
  const [amount, setAmount] = useState("0.01");
  const { address } = useAccount();

  const { data, writeContract } = useWriteContract();
  const depositedBalance = useReadContract({
    address: to,
    abi,
    functionName: "balanceOf",
    args: [address],
  });

  const {
    isLoading,
    error: txError,
    isSuccess: txSuccess,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  const handleSendTransation = () => {
    writeContract({
      address: to,
      abi,
      functionName: "withdraw",
      args: [parseEther(amount)],
    });
  };

  useEffect(() => {
    if (txSuccess) {
      toast.success(`Transaction successful with hash: ${data}`);
      depositedBalance.refetch();
    } else if (txError) {
      toast.error(`Transaction failed: ${txError.cause}`);
    }
  }, [txSuccess, txError]);

  const formatBalance = (balance: bigint) => {
    return parseFloat(formatEther(balance, "wei")).toFixed(6);
  };

  const isButtonDisabled = !address || amount === "" || !depositedBalance.data || isLoading;

  const setMaxAmount = () => {
    setAmount(formatEther((depositedBalance.data as bigint), "wei"));
  };

  return (
    <Form.Root onSubmit={e => e.preventDefault()}>
      <Text as="p" className="mb-4">From <Strong>{SITE_NAME}</Strong> to <Strong>Blast</Strong></Text>

      <Form.Field name="amount" className="mb-8">
        <Flex gap="3" align="center" className="mb-2">
          <Form.Control asChild>
            <TextField.Input className="Input" type="number" required onChange={(e) => setAmount(e.target.value)} value={amount} />
          </Form.Control>
          <Text size="5" weight="bold" align="center">ETH</Text>
        </Flex>
        <Flex gap="2" align="center">
          <Text size="2" color="gray">
            Your balance: {!!depositedBalance.data ? formatBalance(depositedBalance.data as bigint) : "-"}
          </Text>
          <Button size="1" variant="soft" onClick={setMaxAmount}>Max</Button>
        </Flex>
        <Form.Message match="valueMissing" className="text-red-500">
          <Text size="2">Please enter your amount</Text>
        </Form.Message>

      </Form.Field>

      <Flex justify="center">
        <Button size="4" disabled={isButtonDisabled} onClick={handleSendTransation}>
          {isLoading ? "Loading..." : "Withdraw"}
        </Button>
      </Flex>
    </Form.Root>
  );

}