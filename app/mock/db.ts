import { PlaneCells } from "@/components/playground/type";
import { RoomDetail } from "../rooms/types";
import { kv } from "@vercel/kv";

type RoomDbDetail = Omit<RoomDetail, "planes"> & {
  allPlacedPlanes: Record<string, PlaneCells[]>;
};

export const readDB = async () => {
  const data = (await kv.get("rooms")) ?? [];
  return data as RoomDbDetail[];

};

export const writeDB = async (data: RoomDbDetail[]) => {
  await kv.set("rooms", data);
};
