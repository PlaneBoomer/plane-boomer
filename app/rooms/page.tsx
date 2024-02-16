import { Flex } from "@radix-ui/themes";
import { RoomList } from "./room-list";
import { CreateRoomButton } from "./create-room-button";

export default function RoomPage() {
  return (
    <Flex direction="column" gap="3">
      <CreateRoomButton />
      <RoomList />
    </Flex>
  );
}
