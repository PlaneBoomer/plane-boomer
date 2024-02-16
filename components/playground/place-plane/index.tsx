"use client";
import { ContextMenu, Strong, Text } from "@radix-ui/themes";
import { clsx } from "clsx";
import { Playground } from "../playground";
import { usePlacePlanes } from "./use-place-planes";
import { RotateCounterClockwiseIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useStableFn } from "@/lib/hooks/use-stable-fn";
import { useEffect } from "react";
import type { PlaneCells } from "../type";
import { startTransition } from "react";

interface PlacePlaneProps {
  className?: string;
  onPlacedPlanesChange?: (placedPlanes: PlaneCells[]) => void | Promise<void>;
  disabled?: boolean;
}

const toolTip = (
  <span className="grid grid-cols-1 gap-2">
    <Text as="span">
      <Strong>Click</Strong> the previewing plane to place it.
    </Text>
    <Text as="span">
      <Strong>Right Click</Strong> the plane to rotate or delete it.
    </Text>
  </span>
);

export function PlacePlane(props: PlacePlaneProps) {
  const { disabled } = props;
  const onPlacedPlanesChange = useStableFn(
    props.onPlacedPlanesChange || (() => void 0)
  );
  const {
    placedPlanes,
    setPreviewingPlaneCenter,
    placePreviewingPlane,
    isCellInPlacedPlanes,
    isCellInPreviewingPlane,
    rotatePlacedPlaneByCellIDFn,
    rotatePreviewPlaneFn,
    deletePlacedPlaneByCellID,
  } = usePlacePlanes();

  useEffect(() => {
    onPlacedPlanesChange(Object.values(placedPlanes));
  }, [placedPlanes, onPlacedPlanesChange]);

  return (
    <Playground className={props.className} toolTip={toolTip}>
      {(cellID: string) => {
        const isPreviewingPlaneCell = isCellInPreviewingPlane(cellID);
        const isPlacedPlaneCell = isCellInPlacedPlanes(cellID);
        let rotatePlane: (() => void) | null = null;
        if (isPlacedPlaneCell) {
          rotatePlane = rotatePlacedPlaneByCellIDFn(cellID);
        } else if (isPreviewingPlaneCell) {
          rotatePlane = rotatePreviewPlaneFn();
        }
        return (
          <div
            className={clsx("w-full h-full", {
              "bg-slate-400": isPlacedPlaneCell,
              "bg-slate-300": isPreviewingPlaneCell,
              "hover:cursor-pointer":
                !disabled && (isPreviewingPlaneCell || isPlacedPlaneCell),
            })}
            onMouseOver={() => {
              startTransition(() => {
                if (!disabled && !isPlacedPlaneCell) {
                  setPreviewingPlaneCenter(cellID);
                }
              });
            }}
          >
            {!disabled && (isPlacedPlaneCell || isPreviewingPlaneCell) && (
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <div
                    className="w-full h-full"
                    onClick={() => {
                      startTransition(() => {
                        if (isPreviewingPlaneCell) {
                          placePreviewingPlane();
                        }
                      });
                    }}
                  />
                </ContextMenu.Trigger>
                <ContextMenu.Content variant="soft">
                  <ContextMenu.Item
                    disabled={!rotatePlane}
                    onSelect={() => {
                      startTransition(() => {
                        rotatePlane?.();
                      });
                    }}
                  >
                    Rotate
                    <RotateCounterClockwiseIcon className="ml-4" />
                  </ContextMenu.Item>
                  {isPlacedPlaneCell && (
                    <ContextMenu.Item
                      color="red"
                      onSelect={() => {
                        startTransition(() => {
                          deletePlacedPlaneByCellID(cellID);
                        });
                      }}
                    >
                      Delete
                      <Cross1Icon className="ml-4" />
                    </ContextMenu.Item>
                  )}
                </ContextMenu.Content>
              </ContextMenu.Root>
            )}
          </div>
        );
      }}
    </Playground>
  );
}
