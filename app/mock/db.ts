import { PlaneCells } from "@/components/playground/type";
import { RoomDetail } from "../rooms/types";
import fse from "fs-extra";

type RoomDbDetail = Omit<RoomDetail, "planes"> & {
  allPlacedPlanes: Record<string, PlaneCells[]>;
};

export const readDB = async () => {
  if (!fse.existsSync("db.json")) {
    await fse.outputJSON("db.json", []);
  }
  const content = await fse.readJSON("db.json");
  return content as RoomDbDetail[];
};

export const writeDB = async (data: RoomDbDetail[]) => {
  await fse.outputJSON("db.json", data);
};
