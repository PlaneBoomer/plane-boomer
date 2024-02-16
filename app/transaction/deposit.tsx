"use client";
import { useAccount, useBalance, useEstimateGas, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import { toast } from "sonner";
import * as Form from "@radix-ui/react-form";
import { PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS } from "@/lib/const/contract";
import type { Address } from "@/types/web3";
import { Text, TextField, Button, Strong, Flex } from "@radix-ui/themes";
import { SITE_NAME } from "@/lib/const";
import "./style.css";

const to: Address = PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS;

export default function Deposit() {
  const [amount, setAmount] = useState("0.01");
  const { address } = useAccount();
  const balance = useBalance({
    address,
  });

  const { data: estimateData, error: estimateError } = useEstimateGas({
    to,
    value: parseEther(amount),
  });

  const { data, sendTransaction } = useSendTransaction();

  const {
    isLoading,
    error: txError,
    isSuccess: txSuccess,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  const handleSendTransation = () => {
    if (estimateError) {
      toast.error(`Transaction failed: ${estimateError.cause}`);
      return;
    }
    sendTransaction({
      gas: estimateData,
      value: parseEther(amount),
      to
    });
  };

  useEffect(() => {
    if (txSuccess) {
      toast.success(`Transaction successful with hash: ${data}`);
      balance.refetch();
    } else if (txError) {
      toast.error(`Transaction failed: ${txError.cause}`);
    }
  }, [txSuccess, txError]);

  const formatBalance = (balance: bigint) => {
    return parseFloat(formatEther(balance, "wei")).toFixed(6);
  };

  const isButtonDisabled = !address || Boolean(estimateError) || amount === "" || parseFloat(amount) < 0.01 || isLoading;

  return (
    <Form.Root onSubmit={e => e.preventDefault()}>
      <Text as="p" className="mb-4">From <Strong>Blast</Strong> to <Strong>{SITE_NAME}</Strong></Text>

      <Form.Field name="amount" className="mb-8">
        <Flex gap="3" align="center" className="mb-2">
          <Form.Control asChild>
            <TextField.Input className="Input" type="number" required onChange={(e) => setAmount(e.target.value)} value={amount} />
          </Form.Control>
          <Text size="5" weight="bold" align="center">ETH</Text>
        </Flex>

        <Text as="p" size="2" color="gray">
          {balance.data ?
            `Your balance: ${formatBalance(balance.data!.value)}` :
            "Please connect your wallet"
          }
        </Text>

        <Form.Message match="valueMissing" className="text-red-500">
          <Text size="2">Please enter your amount</Text>
        </Form.Message>

        <Form.Message match={
          (value) => {
            return parseFloat(value) < 0.01;
          }
        } className="text-red-500">
          <Text size="2">Please enter a amount greater than 0.01</Text>
        </Form.Message>

      </Form.Field>
      <Flex justify="center">
        <Button size="4" disabled={isButtonDisabled} onClick={handleSendTransation}>
          {isLoading ? "Loading..." : "Deposit"}
        </Button>
      </Flex>
    </Form.Root>
  );

}