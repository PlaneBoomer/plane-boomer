"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Flex,
  TextField,
  Text,
  Strong,
} from "@radix-ui/themes";
import { useChannel, usePresence } from "ably/react";
import { toast } from "sonner";

const getRandomName = () => {
  const names = ["Philip", "Simon", "Aliya"];
  return names[Date.now() % names.length];
};

interface Props {
  params: {
    roomID: string;
  };
}

export default function DemoPage({ params }: Props) {
  const { roomID } = params;
  const [msg, setMsg] = useState("");
  const [name, setName] = useState(() => getRandomName());
  const { channel } = useChannel(`room:${roomID}`, (msg) => {
    console.log(msg);
    toast(msg.data);
  });
  const { presenceData, updateStatus } = usePresence(`room:${roomID}`, name);
  console.log(channel.state);
  return (
    <Container p="9">
      <Flex gap="2" align="start" justify="center" direction="column">
        <TextField.Root>
          <TextField.Slot>Your name:</TextField.Slot>
          <TextField.Input
            value={name}
            disabled={channel.state !== "attached"}
            onChange={(e) => {
              setName(e.target.value);
              updateStatus(e.target.value);
            }}
          />
        </TextField.Root>
        <Flex gap="2">
          <TextField.Root>
            <TextField.Slot>Message:</TextField.Slot>
            <TextField.Input
              value={msg}
              onChange={(e) => {
                setMsg(e.target.value);
              }}
            />
          </TextField.Root>
          <Button
            disabled={channel.state !== "attached"}
            onClick={() => {
              channel.publish("chat", msg);
            }}
          >
            Send
          </Button>
        </Flex>
        {channel.state === "attached" ? (
          <Flex gap="2">
            <Strong>在线用户:</Strong>
            {presenceData.map((item) => {
              return <Text key={item.id}>{item.data}</Text>;
            })}
          </Flex>
        ) : (
          "连接中"
        )}
      </Flex>
    </Container>
  );
}
