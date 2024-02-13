import { useStableFn } from "@/lib/hooks/use-stable-fn";
import { Box, Grid, Flex, Em, Tooltip } from "@radix-ui/themes";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { PLAYGROUND } from "./constants";
import clsx from "clsx";

const getMatrix = (rows: number, columns: number) => {
  const matrix: Array<string> = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      matrix.push(`${row},${column}`);
    }
  }
  return matrix;
};
const getSerialIDs = (n: number, isAlpha = false) => {
  const ids = [];
  const startRowID = isAlpha ? "a".charCodeAt(0) : 0;
  for (let i = 0; i < n; i++) {
    ids.push(isAlpha ? String.fromCharCode(startRowID + i) : i);
  }
  return ids;
};

const matrix = getMatrix(PLAYGROUND.ROWS, PLAYGROUND.COLUMNS);
const rowIDs = getSerialIDs(PLAYGROUND.ROWS, true);
const columnIDs = getSerialIDs(PLAYGROUND.COLUMNS, false);

const Cell = ({
  children,
  border = false,
  className,
}: {
  children: React.ReactNode;
  border?: boolean;
  className?: string;
}) => {
  return (
    <Box
      className={clsx(
        border && "border",
        className,
        "inline-flex items-center justify-center"
      )}
      width="6"
      height="6"
    >
      {children}
    </Box>
  );
};

interface PlaygroundProps {
  children: (cellID: string) => React.ReactNode;
  toolTip?: React.ReactNode;
  className?: string;
}

export function Playground(props: PlaygroundProps) {
  const { children, toolTip = "", className } = props;
  const cellRender = useStableFn(children);
  return (
    <div className={clsx("inline-grid grid-cols-[1fr_16fr]", className)}>
      <Cell>
        {toolTip && (
          <Tooltip content={toolTip}>
            <QuestionMarkCircledIcon />
          </Tooltip>
        )}
      </Cell>
      <Flex direction="row" display="inline-flex">
        {columnIDs.map((columnID) => (
          <Cell key={columnID}>
            <Em className="text-sm">{columnID}</Em>
          </Cell>
        ))}
      </Flex>
      <Flex direction="column" display="inline-flex">
        {rowIDs.map((rowID) => (
          <Cell key={rowID}>
            <Em className="text-sm">{rowID}</Em>
          </Cell>
        ))}
      </Flex>
      <Grid display="inline-grid" columns={`${PLAYGROUND.COLUMNS}`}>
        {matrix.map((cellID) => {
          return (
            <Cell key={cellID} border>
              {cellRender(cellID)}
            </Cell>
          );
        })}
      </Grid>
    </div>
  );
}
