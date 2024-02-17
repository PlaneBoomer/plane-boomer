import { NextResponse, type NextRequest } from "next/server";
import { readDB, writeDB } from "@/app/mock/db";
import { Address } from "@/types/web3";
import { ROOM_STATUS } from "@/app/rooms/types";
import { notifyRoomDetailUpdate } from "@/lib/server/ably-rest-client";

// 确认guest
export async function POST(
  req: NextRequest,
  options: { params: { roomID: string } }
) {
  const payload: { guest: Address } = await req.json();
  const { roomID } = options.params;
  const rooms = await readDB();
  const room = rooms.find((item) => item.id === roomID);
  if (room) {
    room.players.guest = payload.guest;
    room.status = ROOM_STATUS.CONFIRMED;
  }
  notifyRoomDetailUpdate(roomID, room);
  await writeDB(rooms);
  return NextResponse.json({
    success: true,
  });
}
