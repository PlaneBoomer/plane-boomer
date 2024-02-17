import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { readDB, writeDB } from "@/app/mock/db";
import { ROOM_STATUS } from "@/app/rooms/types";
import { notifyRoomDetailUpdate } from "@/lib/server/ably-rest-client";
import { writeContract, waitForTransactionReceipt } from "viem/actions";
import { client } from "@/app/api/utils/web3";
import { PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS } from "@/lib/const/contract";
import abi from "@/abis/planeBoomer.json";
import { parseEther } from "viem";

// 摆放飞机
export async function POST(
  req: NextRequest,
  options: { params: { roomID: string } }
) {
  const operator = cookies().get("addr")?.value || "";
  const payload = await req.json();
  const { roomID } = options.params;
  const rooms = await readDB();
  const room = rooms.find((item) => item.id === roomID);
  if (room) {
    const { planes, r, s, v } = payload;
    room.allPlacedPlanes[operator] = planes;
    room.rsv = room.rsv || {};
    room.rsv[operator] = { r, s, v };
    if (Object.values(room.allPlacedPlanes).length === 2) {
      const owner = room.players.owner;
      const guest = room.players.guest!;
      const hashData = await writeContract(
        client,
        {
          address: PLANE_BOOMER_BLAST_SEPOLIA_ADDRESS,
          abi,
          functionName: "permitStartGame",
          args: [
            room.players.owner,
            room.players.guest,
            parseEther(room.bet.toString()).toString(),
            room.rsv[owner].v,
            room.rsv[owner].r,
            room.rsv[owner].s,
            room.rsv[guest].v,
            room.rsv[guest].r,
            room.rsv[guest].s
          ],
        }
      );
      waitForTransactionReceipt(client, { hash: hashData });
      room.status = ROOM_STATUS.STARTED;
      room.players.first = room.players.owner;
    }
    await writeDB(rooms);
    notifyRoomDetailUpdate(roomID, room);
    return NextResponse.json({
      success: true,
    });
  }
  return NextResponse.json(
    {
      success: false,
    },
    {
      status: 404,
    }
  );
}

// 获取摆放好的飞机
export async function GET(
  req: NextRequest,
  options: { params: { roomID: string } }
) {
  const operator = cookies().get("addr")?.value || "";
  const { roomID } = options.params;
  const rooms = await readDB();
  const room = rooms.find((item) => item.id === roomID);
  if (room) {
    return NextResponse.json({
      planes: room.allPlacedPlanes[operator] || [],
    });
  }
  return NextResponse.json(
    {
      planes: [],
    },
    {
      status: 404,
    }
  );
}
