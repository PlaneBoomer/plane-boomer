import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { readDB, writeDB } from "@/app/mock/db";
import { ROOM_STATUS } from "@/app/rooms/types";
import { notifyRoomDetailUpdate } from "@/lib/server/ably-rest-client";

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
    room.allPlacedPlanes[operator] = payload.planes;
    if (Object.values(room.allPlacedPlanes).length === 2) {
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
