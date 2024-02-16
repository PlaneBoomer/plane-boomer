import { useState, useMemo } from "react";
import { PlaneUtil, getCellPosition } from "../utils";
import type { PlaneCells } from "../type";
import { useStableFn } from "@/lib/hooks/use-stable-fn";
import { DEFAULT_PLANE_NUM } from "../constants";

export const usePlacePlanes = (maxPlaneNum: number = DEFAULT_PLANE_NUM) => {
  const [placedPlanes, setPlacedPlanes] = useState<Record<string, PlaneCells>>(
    {}
  );

  const placedPlaneNum = useMemo(
    () => Object.keys(placedPlanes).length,
    [placedPlanes]
  );

  const [previewCellID, setPreviewCellID] = useState<string>("");
  const [previewingPlaneRotatedTimes, setPreviewingPlaneRotatedTimes] =
    useState<number>(0);

  const stringifiedPlacedPlanes = useMemo(
    () => Object.keys(placedPlanes).join("\n"),
    [placedPlanes]
  );

  const previewingPlane = useMemo<PlaneCells>(() => {
    const centerPosition = getCellPosition(previewCellID);
    const planeCells = PlaneUtil.create(
      centerPosition,
      previewingPlaneRotatedTimes
    );
    if (
      PlaneUtil.isOutOfPlayground(planeCells) ||
      PlaneUtil.isConflict(Object.values(placedPlanes), planeCells)
    ) {
      return [];
    }
    return planeCells;
  }, [previewCellID, placedPlanes, previewingPlaneRotatedTimes]);

  const setPreviewingPlaneCenter = useStableFn((cellID: string) => {
    if (placedPlaneNum < maxPlaneNum) {
      setPreviewCellID(cellID);
    }
  });

  const placePreviewingPlane = useStableFn(() => {
    if (previewingPlane.length > 0) {
      setPlacedPlanes((prev) => {
        return {
          ...prev,
          [PlaneUtil.stringify(previewingPlane)]: [...previewingPlane],
        };
      });
      setPreviewCellID("");
      setPreviewingPlaneRotatedTimes(0);
    }
  });

  const isCellInPlacedPlanes = useStableFn((cellID: string) => {
    return stringifiedPlacedPlanes.includes(`[${cellID}]`);
  });

  const isCellInPreviewingPlane = useStableFn((cellID: string) => {
    return PlaneUtil.stringify(previewingPlane).includes(`[${cellID}]`);
  });

  const rotatePlacedPlaneByCellIDFn = useStableFn((cellID: string) => {
    const targetStringifiedPlane = Object.keys(placedPlanes).find((planeStr) =>
      planeStr.includes(`[${cellID}]`)
    );
    if (!targetStringifiedPlane) {
      return null;
    }
    const restPlanes = Object.keys(placedPlanes)
      .filter((item) => item !== targetStringifiedPlane)
      .map((item) => placedPlanes[item]);
    const originPlane = placedPlanes[targetStringifiedPlane];
    const rotatedPlane = PlaneUtil.rotate(originPlane);
    if (
      PlaneUtil.isOutOfPlayground(rotatedPlane) ||
      PlaneUtil.isConflict(restPlanes, rotatedPlane)
    ) {
      return null;
    }
    return () => {
      setPlacedPlanes((prev) => {
        const { [targetStringifiedPlane]: _, ...restPlanes } = prev;
        return {
          ...restPlanes,
          [PlaneUtil.stringify(rotatedPlane)]: rotatedPlane,
        };
      });
    };
  });

  const deletePlacedPlaneByCellID = useStableFn((cellID: string) => {
    const targetStringifiedPlane = Object.keys(placedPlanes).find((planeStr) =>
      planeStr.includes(`[${cellID}]`)
    );
    if (!targetStringifiedPlane) {
      return;
    }
    setPlacedPlanes((prev) => {
      const { [targetStringifiedPlane]: _, ...restPlanes } = prev;
      return restPlanes;
    });
  });

  const rotatePreviewPlaneFn = useStableFn(() => {
    const rotatedPreviewPlane = PlaneUtil.rotate(previewingPlane);
    if (
      PlaneUtil.isOutOfPlayground(rotatedPreviewPlane) ||
      PlaneUtil.isConflict(Object.values(placedPlanes), rotatedPreviewPlane)
    ) {
      return null;
    }
    return () => {
      setPreviewingPlaneRotatedTimes((prev) => prev + 1);
    };
  });

  return {
    placedPlanes,
    previewingPlane,
    setPreviewingPlaneCenter,
    placePreviewingPlane,
    isCellInPlacedPlanes,
    isCellInPreviewingPlane,
    rotatePlacedPlaneByCellIDFn,
    rotatePreviewPlaneFn,
    deletePlacedPlaneByCellID,
  };
};
