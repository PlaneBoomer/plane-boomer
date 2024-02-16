import { Playground } from "../playground";
import { PlaneCells } from "../type";
import { PlaneUtil } from "../utils";
import { clsx } from "clsx";
import { Flex } from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";

interface Props {
  myPlanes: PlaneCells[];
  destroyedCells: number[][];
}

export function WithstandAttack(props: Props) {
  const { destroyedCells, myPlanes } = props;
  const destroyedCellsStr = PlaneUtil.stringify(destroyedCells);
  const myPlanesStr = myPlanes.map(PlaneUtil.stringify).join("\n");
  return (
    <Playground>
      {(cellID) => {
        return (
          <Flex
            className={clsx("w-full h-full", {
              "bg-slate-400": myPlanesStr.includes(`[${cellID}]`),
            })}
            justify="center"
            align="center"
          >
            {destroyedCellsStr && <Cross1Icon />}
          </Flex>
        );
      }}
    </Playground>
  );
}
