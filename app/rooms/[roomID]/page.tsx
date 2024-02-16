"use client";
import { Playground } from "@/components/playground";
import { useRoom } from "./use-room";
import { InfoPanel } from "./info-panel";
import { ROOM_STATUS, RoomDetail } from "../types";
import { Flex } from "@radix-ui/themes";
import { useState } from "react";
import { PlaneCells } from "@/components/playground/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccountInfo } from "@/lib/hooks/use-account-info";

interface Props {
  params: {
    roomID: string;
  };
}

const useMyPlanes = (roomID: string) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["myPlanes", roomID],
    queryFn: async () => {
      const res = await fetch(`/api/rooms/${roomID}/planes`);
      const data = await res.json();
      return (data.planes || []) as PlaneCells[];
    },
  });
  const mutation = useMutation({
    mutationFn: async (planes: PlaneCells[]) => {
      await fetch(`/api/rooms/${roomID}/planes`, {
        method: "POST",
        body: JSON.stringify({ planes }),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["myPlanes", roomID] });
      query.refetch();
    },
  });
  return {
    query: {
      ...query,
      data: (query.data || []) as PlaneCells[],
    },
    mutation,
  };
};

export default function RoomDetailPage(props: Props) {
  const { roomID } = props.params;
  const { isLoading, isUpdating, channel, mutations, roomData } =
    useRoom(roomID);
  const myPlanes = useMyPlanes(roomID);
  const [placedPlanes, setPlacedPlanes] = useState<PlaneCells[]>([]);
  const isAttaching = isLoading || channel.state !== "attached";
  const prepared = myPlanes.query.data.length > 0;
  const account = useAccountInfo();
  if (isAttaching) {
    return <div>Attaching...</div>;
  }
  const destroyedCells =
    roomData?.rounds
      .filter((item) => {
        item.attacker !== account.address;
      })
      .map((item) => item.position) || [];
  return (
    <Flex justify="between" gap="4">
      <InfoPanel
        prepared={prepared}
        roomData={roomData as RoomDetail}
        isUpdating={isUpdating}
        channel={channel}
        mutations={{
          ...mutations,
          placePlanes: myPlanes.mutation.mutate,
        }}
        placedPlanes={placedPlanes}
      />
      {roomData?.status === ROOM_STATUS.CREATED && (
        <>
          <Playground>{() => null}</Playground>
          <Playground>{() => null}</Playground>
        </>
      )}
      {roomData?.status === ROOM_STATUS.CONFIRMED && (
        <>
          <Playground.PlacePlane
            disabled={prepared || isUpdating}
            onPlacedPlanesChange={(planes) => setPlacedPlanes(planes)}
          />
          <Playground>{() => null}</Playground>
        </>
      )}
      {roomData?.status === ROOM_STATUS.STARTED && (
        <>
          <Playground.WithstandAttack
            myPlanes={myPlanes.query.data}
            destroyedCells={destroyedCells}
          />
          <Playground.AttackEnemy />
        </>
      )}
    </Flex>
  );
}
