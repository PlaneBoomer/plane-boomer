import { PLANE_BODY, PLAYGROUND } from "./constants";
import type { PlaneCells } from "./type";

function sinTheta(rotatedTimes: number) {
  const rotatedTimesToSinThetaMap: Record<string, number> = {
    0: 0,
    1: 1,
    2: 0,
    3: -1,
  };
  return rotatedTimesToSinThetaMap[(rotatedTimes % 4).toString()];
}

function cosTheta(rotatedTimes: number) {
  const rotatedTimesToSinThetaMap: Record<string, number> = {
    0: 1,
    1: 0,
    2: -1,
    3: 0,
  };
  return rotatedTimesToSinThetaMap[(rotatedTimes % 4).toString()];
}

function rotatePoint(
  point: number[],
  zeroPoint: number[],
  rotatedTimes: number
) {
  const [x, y] = point;
  const [m, n] = zeroPoint;
  // const xPrime = (x - m) * Math.cos(theta) - (y - n) * Math.sin(theta) + m;
  const xPrime =
    (x - m) * cosTheta(rotatedTimes) - (y - n) * sinTheta(rotatedTimes) + m;
  // const yPrime = (x - m) * Math.sin(theta) + (y - n) * Math.cos(theta) + n;
  const yPrime =
    (x - m) * sinTheta(rotatedTimes) + (y - n) * cosTheta(rotatedTimes) + n;
  return [xPrime, yPrime];
}

export const PlaneUtil = {
  create: (centerPosition: number[], rotatedTimes = 0): PlaneCells => {
    if (centerPosition.length === 0) {
      return [];
    }
    const [x, y] = centerPosition;
    return [
      [x - 1, y],
      [x, y - 2],
      [x, y - 1],
      [x, y],
      [x, y + 1],
      [x, y + 2],
      [x + 1, y],
      [x + 2, y - 1],
      [x + 2, y],
      [x + 2, y + 1],
    ].map((position) => rotatePoint(position, centerPosition, rotatedTimes));
  },
  rotate: (planeCells: PlaneCells): PlaneCells => {
    return planeCells.map((position) =>
      rotatePoint(position, planeCells[PLANE_BODY.CENTER], 1)
    );
  },
  stringify: (planeCells: PlaneCells): string => {
    return planeCells.map((item) => `[${item.join(",")}]`).join("\n");
  },
  getCenterPosition: (planeCells: PlaneCells): number[] => {
    return planeCells[PLANE_BODY.CENTER];
  },
  getHeadPosition: (planeCells: PlaneCells): number[] => {
    return planeCells[PLANE_BODY.HEAD];
  },
  isOutOfPlayground: (planeCells: PlaneCells): boolean => {
    if (planeCells.length === 0) {
      return false;
    }
    const keyCoordinates = [
      ...planeCells[PLANE_BODY.HEAD],
      ...planeCells[PLANE_BODY.LEFT_WING],
      ...planeCells[PLANE_BODY.RIGHT_WING],
      ...planeCells[PLANE_BODY.TAIL],
    ];
    return keyCoordinates.some((coordinate) => {
      return (
        coordinate < 0 ||
        coordinate >= PLAYGROUND.ROWS ||
        coordinate >= PLAYGROUND.COLUMNS
      );
    });
  },
  isConflict: (planeSets: PlaneCells[], plane: PlaneCells): boolean => {
    const stringifiedPlaneSets = planeSets.map(PlaneUtil.stringify).join("\n");
    for (const cellPosition of plane) {
      const isOccupied = stringifiedPlaneSets.includes(`[${cellPosition}]`);
      if (isOccupied) {
        return true;
      }
    }
    return false;
  },
};

export const getCellPosition = (cellID: string) => {
  return cellID
    .split(",")
    .filter((item) => !!item)
    .map(Number);
};
