import { useMemo } from "react";
import { Playground } from "../playground";
import { AttackResult } from "../type";
import { Flex } from "@radix-ui/themes";
import { clsx } from "clsx";

interface Props {
  attackResults: Array<{
    position: Array<number>;
    result: AttackResult;
  }>;
  onAttack: (position: Array<number>) => void;
  isUpdating: boolean;
  disableAttack: boolean;
}

import { Cross1Icon } from "@radix-ui/react-icons";
import { getCellPosition } from "../utils";

export function AttackEnemy(props: Props) {
  const { attackResults, isUpdating, onAttack, disableAttack } = props;
  const attackResultsMap = useMemo(() => {
    const map = new Map<string, AttackResult>();
    attackResults.forEach(({ position, result }) => {
      map.set(position.toString(), result);
    });
    return map;
  }, [attackResults]);
  return (
    <Playground>
      {(cellID) => {
        return (
          <Flex
            className={clsx("w-full h-full", {
              "bg-green-400":
                attackResultsMap.get(cellID) === AttackResult.BODY,
              "bg-red-400": attackResultsMap.get(cellID) === AttackResult.HEAD,
              "hover:cursor-wait": isUpdating,
              "hover:cursor-pointer": !isUpdating && !disableAttack,
            })}
            justify="center"
            align="center"
            onClick={() => {
              if (
                !isUpdating &&
                !attackResultsMap.has(cellID) &&
                !disableAttack
              ) {
                onAttack(getCellPosition(cellID));
              }
            }}
          >
            {attackResultsMap.has(cellID) && <Cross1Icon />}
          </Flex>
        );
      }}
    </Playground>
  );
}
