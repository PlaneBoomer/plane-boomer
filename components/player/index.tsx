import type { Address } from "@/types/web3";
import { Avatar, Flex, Text, Tooltip } from "@radix-ui/themes";
import { AvatarIcon } from "@radix-ui/react-icons";

interface Props {
  address: Address;
}

export const Player = ({ address }: Props) => {
  return (
    <Tooltip content={address}>
      <Flex
        display="inline-flex"
        className="max-w-44 min-w-28"
        gap="2"
        align="center"
      >
        <Avatar size="1" fallback={<AvatarIcon />} />
        <Text color="blue" className="truncate">
          {address}
        </Text>
      </Flex>
    </Tooltip>
  );
};
