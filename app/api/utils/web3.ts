import { createClient, http } from "viem";
import { blastSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
export const account = privateKeyToAccount(process.env.PRIVATE_KEY as unknown as `0x${string}`);
export const client = createClient({
  chain: blastSepolia,
  transport: http(),
  account,
});

