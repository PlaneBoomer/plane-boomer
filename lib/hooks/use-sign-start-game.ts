import { PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS } from "../const/contract";
import { useChainId, useClient, useAccount, useSignTypedData } from "wagmi";
import { readContract } from "viem/actions";
import { slice } from "viem";

import abi from "@/abis/planeBoomer.json";

interface StartGameSignData {
  player1: string;
  player2: string;
  value: string;
}

export function useSignStartGame() {
  const { signTypedDataAsync } = useSignTypedData();
  const id = useChainId();
  const client = useClient();
  const account = useAccount();

  const signStartGame = async ({
    player1,
    player2,
    value,
  }: StartGameSignData
  ) => {
    const nonce = await readContract(client!, {
      address: PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS,
      functionName: "nonces",
      abi: abi,
      args: [account.address]
    });

    const data: Parameters<typeof signTypedDataAsync>[0] = {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        StartGame: [
          { name: "player1", type: "address" },
          { name: "player2", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      },
      primaryType: "StartGame",
      domain: {
        name: "PlaneBoomer",
        version: "1",
        chainId: id,
        verifyingContract: PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS
      },
      message: {
        player1,
        player2,
        value,
        nonce
      }
    };

    const signature = await signTypedDataAsync(data);
    const [r, s, v] = [
      slice(signature, 0, 32),
      slice(signature, 32, 64),
      slice(signature, 64, 65),
    ];
    return { signature, r, s, v };
  }

  return { signStartGame };
}