import { readDB } from "@/app/mock/db";
import { NextResponse, type NextRequest } from "next/server";

// 获取房间信息
export async function GET(
  req: NextRequest,
  options: { params: { roomID: string } }
) {
  const { roomID } = options.params;
  const rooms = await readDB();
  console.log(rooms);
  const room = rooms.find((item) => item.id === roomID);
  if (!room) {
    return NextResponse.json(
      {
        error: "room not found",
      },
      {
        status: 404,
      }
    );
  }
  const { allPlacedPlanes, ...returnedRoom } = room;
  return NextResponse.json({
    ...returnedRoom,
  });
}
