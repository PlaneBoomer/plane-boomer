import { NextResponse, type NextRequest } from "next/server";
import { readDB, writeDB } from "@/app/mock/db";
import { cookies } from "next/headers";
import { Address } from "@/types/web3";
import { AttackResult } from "@/components/playground/type";
import { notifyRoomDetailUpdate } from "@/lib/server/ably-rest-client";
import { ROOM_STATUS } from "@/app/rooms/types";

// 发起攻击
export async function POST(
  req: NextRequest,
  options: { params: { roomID: string } }
) {
  const operator = cookies().get("addr")?.value || "";
  const payload: { position: Array<number> } = await req.json();
  const { roomID } = options.params;
  const rooms = await readDB();
  const room = rooms.find((item) => item.id === roomID);
  if (room) {
    const enemy =
      room.players.owner === operator
        ? (room.players.guest as Address)
        : room.players.owner;
    const enemyPlanes = room.allPlacedPlanes[enemy] || [];
    let result = AttackResult.MISS;
    for (const plane of enemyPlanes) {
      const [headPosition, ...bodyPositions] = plane;
      if (headPosition.toString() === payload.position.toString()) {
        result = AttackResult.HEAD;
        break;
      }
      if (
        bodyPositions.some(
          (position) => position.toString() === payload.position.toString()
        )
      ) {
        result = AttackResult.BODY;
        break;
      }
    }
    room.rounds.push({
      attacker: operator as Address,
      result,
      position: payload.position as [number, number],
    });
    const ownerRounds = room.rounds.filter(
      (round) => round.attacker === room.players.owner
    );
    const guestRounds = room.rounds.filter(
      (round) => round.attacker === room.players.guest
    );
    if (
      ownerRounds.filter((round) => round.result === AttackResult.HEAD)
        .length === room.planesNum
    ) {
      room.status = ROOM_STATUS.END;
      room.players.winner = room.players.owner;
    }
    if (
      guestRounds.filter((round) => round.result === AttackResult.HEAD)
        .length === room.planesNum
    ) {
      room.status = ROOM_STATUS.END;
      room.players.winner = room.players.guest;
    }
    await writeDB(rooms);
    notifyRoomDetailUpdate(roomID, room);
    return NextResponse.json({
      success: true,
    });
  } else {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 404,
      }
    );
  }
}
