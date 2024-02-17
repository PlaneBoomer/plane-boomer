import { useState, useEffect, useMemo } from "react";
import { ROOM_STATUS, type RoomDetail } from "../types";
import { useChannel, usePresence } from "ably/react";
import { useStableFn } from "@/lib/hooks/use-stable-fn";
import { getChannelName } from "./utils";
import { useAccountInfo } from "@/lib/hooks/use-account-info";
import { PlaneCells } from "@/components/playground/type";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const useInitializeRoom = (roomID: string) => {
  const [roomData, setRoomData] = useState<RoomDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsLoading(true);
    // 获取房间信息
    fetch(`/api/rooms/${roomID}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setRoomData(data);
        setIsLoading(false);
      });
  }, [roomID, router]);
  const update = useStableFn((updateFn: () => Promise<void>) => {
    setIsUpdating(true);
    Promise.resolve(updateFn());
  });

  const { channel: abylyChannel } = useChannel(
    getChannelName(roomID),
    (msg) => {
      if (msg.name === "updateRoomInfo") {
        setRoomData(msg.data);
        const roomData = msg.data as RoomDetail;
        if (roomData.status === ROOM_STATUS.STARTED) {
          if (
            (roomData.rounds.length === 0 &&
              roomData.players.first === account.address) ||
            (roomData.rounds.length > 0 &&
              roomData.rounds[roomData.rounds.length - 1].attacker !==
                account.address)
          ) {
            toast("Your turn to attack");
          }
        }
        setIsUpdating(false);
      }
    }
  );
  const account = useAccountInfo();
  const { presenceData } = usePresence(getChannelName(roomID), account);
  const channel = useMemo(() => {
    return {
      state: abylyChannel.state,
      members: presenceData.map((item) => {
        return {
          channelMemberID: item.id,
          clientID: item.clientId,
          account: item.data,
        };
      }),
    };
  }, [abylyChannel, presenceData]);
  return {
    roomData,
    isLoading,
    isUpdating,
    update,
    channel,
  };
};

const useMutateRoom = (
  roomID: string,
  update: ReturnType<typeof useInitializeRoom>["update"]
) => {
  const placePlanes = useStableFn((planes: PlaneCells[]) => {
    update(async () => {
      await fetch(`/api/rooms/${roomID}/planes`, {
        method: "POST",
        body: JSON.stringify({ planes }),
      });
    });
  });
  const confirmGuest = useStableFn((guest: string) => {
    update(async () => {
      await fetch(`/api/rooms/${roomID}/confirm`, {
        method: "POST",
        body: JSON.stringify({
          guest,
        }),
      });
    });
  });
  const attack = useStableFn((position: number[]) => {
    update(async () => {
      await fetch(`/api/rooms/${roomID}/attack`, {
        method: "POST",
        body: JSON.stringify({
          position,
        }),
      });
    });
  });

  const mutations = useMemo(
    () => ({
      placePlanes,
      confirmGuest,
      attack,
    }),
    [placePlanes, confirmGuest, attack]
  );
  return mutations;
};

const useRoomLocking = (
  channel: ReturnType<typeof useInitializeRoom>["channel"],
  roomData: RoomDetail | null,
  update: ReturnType<typeof useInitializeRoom>["update"]
) => {
  const account = useAccountInfo();
  useEffect(() => {
    if (roomData && account.address && account.isConnected) {
      const {
        players: { lockedBy, owner, guest },
      } = roomData;
      const enemyAddress = [owner, guest].find(
        (item) => item !== account.address
      );
      if (roomData.status === ROOM_STATUS.STARTED) {
        const chanelMembersAddresses = channel.members.map(
          (item) => item.account.address
        );
        if (!chanelMembersAddresses.includes(enemyAddress)) {
          update(async () => {
            await fetch(`/api/rooms/${roomData.id}/lock`, {
              method: "POST",
              body: JSON.stringify({}),
            });
          });
        }
      } else if (roomData.status === ROOM_STATUS.LOCKED) {
        if (lockedBy !== account.address) {
          update(async () => {
            await fetch(`/api/rooms/${roomData.id}/unlock`, {
              method: "POST",
              body: JSON.stringify({}),
            });
          });
        }
      }
    }
  }, [channel.members, roomData, update, account.address, account.isConnected]);
};

export const useRoom = (roomID: string) => {
  const { roomData, isLoading, isUpdating, update, channel } =
    useInitializeRoom(roomID);
  const mutations = useMutateRoom(roomID, update);
  // useRoomLocking(channel, roomData, update);
  return {
    roomData,
    isLoading,
    isUpdating,
    channel,
    mutations,
  };
};
