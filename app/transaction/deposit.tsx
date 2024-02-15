"use client";
import { useAccount, useBalance, useEstimateGas, useReadContract, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import { toast, Toaster } from "sonner";
import * as Form from "@radix-ui/react-form";
import { PLANE_BOOMER_BALST_SEPOLIA_ADDRESS } from "@/lib/const/contract";
import type { Address } from "@/types/web3";
import { Text } from "@radix-ui/themes";
import abi from "@/abis/planeBoomer.json";

const to: Address = PLANE_BOOMER_BALST_SEPOLIA_ADDRESS;

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
      depositedBalance.refetch();
    } else if (txError) {
      toast.error(`Transaction failed: ${txError.cause}`);
    }
  }, [txSuccess, txError]);

  const formatBalance = (balance: bigint) => {
    return parseFloat(formatEther(balance, "wei")).toFixed(4);
  };

  const isButtonDisabled = !address || Boolean(estimateError) || amount === "" || parseFloat(amount) < 0.01 || isLoading;

  return (
    <Form.Root onSubmit={e => e.preventDefault()}>
      <Form.Field name="amount">

        <Form.Control asChild>
          <input className='' type="number" required onChange={(e) => setAmount(e.target.value)} value={amount} />
        </Form.Control>

        <Form.Message match="valueMissing" className="text-red-500">
          Please enter your amount
        </Form.Message>

        <Form.Message match={
          (value) => parseFloat(value) < 0.01
        } className="text-red-500">
          Please enter a amount greater than 0.01
        </Form.Message>
      </Form.Field>
      <div className='flex flex-col'>
        <Text>
          {balance.data ?
            `Your balance: ${formatBalance(balance.data!.value)}` :
            "Please connect your wallet"
          }
        </Text>

        <Text>
          {!!depositedBalance.data  && `Your deposited balance: ${formatBalance(depositedBalance.data as bigint)}`}
        </Text>
      </div>

      <button disabled={isButtonDisabled} className='btn' onClick={handleSendTransation}>
        {isLoading ? "Loading..." : "Deposit"}
      </button>
      <Toaster />
    </Form.Root>
  );

}