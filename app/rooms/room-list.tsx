"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoomDetail } from "./types";
import { ROOM_STATUS } from "./types";
import { Flex, Link, Text } from "@radix-ui/themes";
import NextLink from "next/link";
import { useAccountInfo } from "@/lib/hooks/use-account-info";
import { useQuery } from "@tanstack/react-query";
import { Player } from "@/components/player";

type RoomListItem = Pick<
  RoomDetail,
  "id" | "bet" | "planesNum" | "playgroundSize" | "status" | "players"
>;

const JoinRoom = ({ room }: { room: RoomListItem }) => {
  const account = useAccountInfo();
  const { id, bet, status } = room;
  const players = [room.players.owner, room.players.guest].filter(Boolean);
  if (
    (account.isConnected &&
      account.chipsAmount >= bet &&
      status === ROOM_STATUS.CREATED) ||
    players.includes(account.address)
  ) {
    return (
      <Link>
        <NextLink href={`/rooms/${id}`}>Join</NextLink>
      </Link>
    );
  }
  return null;
};

export const roomListColumns: Array<ColumnDef<RoomListItem>> = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return ROOM_STATUS[status];
    },
  },
  {
    header: "Bet",
    accessorKey: "bet",
  },
  {
    header: "Planes Num",
    accessorKey: "planesNum",
  },
  {
    header: "Playground Size",
    accessorKey: "playgroundSize",
    cell: ({ row }) => {
      const [x, y] = row.original.playgroundSize;
      return `${x} x ${y}`;
    },
  },
  {
    header: "Players",
    accessorKey: "players",
    cell: ({ row }) => {
      const {
        players: { owner, guest },
      } = row.original;
      if (guest) {
        return (
          <Flex gap="3">
            <Player address={owner} />
            <Text>vs</Text>
            <Player address={guest} />
          </Flex>
        );
      } else {
        return <Player address={owner} />;
      }
    },
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => {
      return <JoinRoom room={row.original} />;
    },
  },
];

export function RoomList() {
  const { data, isPending } = useQuery({
    queryKey: ["rooms-list"],
    queryFn: async () => {
      const response = await fetch("/api/rooms");
      const data = await response.json();
      return data;
    },
  });
  const table = useReactTable({
    data: Array.isArray(data?.rooms) ? data?.rooms : [],
    columns: roomListColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) {
    return "Pending";
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={roomListColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
