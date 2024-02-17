import { NextResponse, type NextRequest } from "next/server";
import { readDB, writeDB } from "@/app/mock/db";
import { ROOM_STATUS } from "@/app/rooms/types";
import { cookies } from "next/headers";
import { Address } from "@/types/web3";

// 获取房间列表
export async function GET(req: NextRequest) {
  return NextResponse.json({
    rooms: (await readDB()).map((room) => {
      const { allPlacedPlanes, rsv, ...returnedRoom } = room;
      return returnedRoom;
    }),
  });
}

// 创建房间
export async function POST(req: NextRequest) {
  const payload = await req.json();
  const rooms = await readDB();
  const operator = cookies().get("addr");
  const roomID = rooms.length + 1 + "";
  rooms.push({
    id: roomID,
    status: ROOM_STATUS.CREATED,
    bet: payload.bet,
    playgroundSize: payload.playgroundSize,
    planesNum: payload.planesNum,
    players: {
      owner: operator?.value as Address,
    },
    allPlacedPlanes: {},
    rounds: [],
    rsv: {},
  });
  await writeDB(rooms);
  return NextResponse.json({
    roomID,
  });
}
