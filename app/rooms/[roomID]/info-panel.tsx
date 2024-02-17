"use client";
import { Button, Flex, Strong, Text } from "@radix-ui/themes";
import { ROOM_STATUS, type RoomDetail } from "../types";
import { Player } from "@/components/player";
import { useEffect, useState, useMemo } from "react";
import { useAccountInfo } from "@/lib/hooks/use-account-info";
import { useRoom } from "./use-room";
import { Address } from "@/types/web3";
import { CheckIcon } from "@radix-ui/react-icons";
import { PlaneCells } from "@/components/playground/type";

interface MemberListProps {
  channel: ReturnType<typeof useRoom>["channel"];
  owner: Address;
  isUpdating: boolean;
  onSubmitGuest: (guest: Address) => void;
}

export const MemberList = (props: MemberListProps) => {
  const {
    channel: { members = [] },
    owner,
    isUpdating,
    onSubmitGuest,
  } = props;
  const [guest, setGuest] = useState<Address | null>(null);
  const account = useAccountInfo();
  const memberAddrs = useMemo(() => {
    return Array.from(
      new Set(
        members
          .filter(
            (item) =>
              item.account.address &&
              item.account.isConnected &&
              owner !== item.account.address
          )
          .map((item) => item.account.address as Address)
      )
    );
  }, [members, owner]);
  useEffect(() => {
    if (!memberAddrs.includes(guest as Address)) {
      setGuest(null);
    }
  }, [memberAddrs, guest]);
  return (
    <Flex direction="column" gap="2">
      <Strong>Members:</Strong>
      {memberAddrs.length === 0 ? (
        <Text>Waiting for players to come in</Text>
      ) : (
        memberAddrs.map((addr) => {
          return (
            <Flex
              key={addr}
              justify="between"
              align="center"
              onClick={() => {
                if (account.address === owner) {
                  setGuest(addr);
                }
              }}
            >
              <Player address={addr} />
              {guest === addr && <CheckIcon />}
            </Flex>
          );
        })
      )}
      {account.address === owner && (
        <Button
          disabled={!guest || isUpdating}
          onClick={() => {
            onSubmitGuest(guest as Address);
          }}
        >
          Confirm
        </Button>
      )}
    </Flex>
  );
};

interface InfoPanelProps {
  roomData: RoomDetail;
  isUpdating: boolean;
  channel: ReturnType<typeof useRoom>["channel"];
  mutations: ReturnType<typeof useRoom>["mutations"];
  placedPlanes: PlaneCells[];
  prepared: boolean;
}

export const InfoPanel = ({
  roomData,
  channel,
  isUpdating,
  mutations,
  placedPlanes = [],
  prepared,
}: InfoPanelProps) => {
  const { bet, players, status } = roomData;
  return (
    <Flex direction="column" gap="3">
      <Flex gap="2">
        <Strong>Bet:</Strong>
        <Text>{bet}</Text>
      </Flex>
      <Flex gap="2">
        <Strong>Status:</Strong>
        {!isUpdating ? ROOM_STATUS[status] : "Updating"}
      </Flex>
      <Flex gap="2">
        <Strong>Owner:</Strong>
        <Player address={players.owner} />
      </Flex>
      {players.guest && (
        <Flex gap="2">
          <Strong>Guest:</Strong>
          <Player address={players.guest} />
        </Flex>
      )}
      {players.winner && (
        <Flex gap="2">
          <Strong>Winner:</Strong>
          <Player address={players.winner} />
        </Flex>
      )}
      {status === ROOM_STATUS.CREATED && (
        <MemberList
          channel={channel}
          owner={players.owner}
          isUpdating={isUpdating}
          onSubmitGuest={mutations.confirmGuest}
        />
      )}
      {status === ROOM_STATUS.CONFIRMED &&
        (!prepared ? (
          <Button
            disabled={placedPlanes.length < roomData.planesNum || isUpdating}
            onClick={() => {
              mutations.placePlanes(placedPlanes);
            }}
          >
            Prepared
          </Button>
        ) : (
          "Waiting for another player to prepare"
        ))}
    </Flex>
  );
};
