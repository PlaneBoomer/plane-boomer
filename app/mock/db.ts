import { PlaneCells } from "@/components/playground/type";
import { RoomDetail } from "../rooms/types";

type RoomDbDetail = Omit<RoomDetail, "planes"> & {
  allPlacedPlanes: Record<string, PlaneCells[]>;
};

let db: RoomDbDetail[] = [];

export const readDB = async () => {
  return db;
};

export const writeDB = async (data: RoomDbDetail[]) => {
  db = data;
};
