import { PlaneCells } from "@/components/playground/type";
import { RoomDetail } from "../rooms/types";
import { kv } from "@vercel/kv";
import { unstable_noStore as noStore } from "next/cache";

type RoomDbDetail = Omit<RoomDetail, "planes"> & {
  allPlacedPlanes: Record<string, PlaneCells[]>;
};

export const readDB = async () => {
  noStore();
  const data = (await kv.get("rooms")) ?? [];
  return data as RoomDbDetail[];
};

export const writeDB = async (data: RoomDbDetail[]) => {
  noStore();
  await kv.set("rooms", data);
};
