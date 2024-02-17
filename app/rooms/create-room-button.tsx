"use client";
import { useAccountInfo } from "@/lib/hooks/use-account-info";
import { Button, RadioGroup, TextFieldInput } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertDialog, Flex } from "@radix-ui/themes";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

export const CreateRoomButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const account = useAccountInfo();
  const formSchema = z.object({
    bet: z.number().min(0).max(account.chipsAmount),
    playgroundSize: z.number().array(),
    planesNum: z.number(),
  });
  const [open, setOpen] = useState(false);
  const createRoomMutation = useMutation({
    mutationFn: async (roomInfo: z.infer<typeof formSchema>) => {
      const res = await fetch("/api/rooms", {
        method: "POST",
        body: JSON.stringify(roomInfo),
      });
      return (await res.json()) as { roomID: string };
    },
    onSuccess({ roomID }) {
      queryClient.invalidateQueries({ queryKey: ["room-list"] });
      router.push(`/rooms/${roomID}`);
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bet: 0,
      playgroundSize: [16, 16],
      planesNum: 3,
    },
  });
  if (account.isConnected) {
    return (
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger>
          <Button
            className="w-44"
            onClick={() => {
              form.reset();
            }}
          >
            Create Room
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Create Room</AlertDialog.Title>
          <Form {...form}>
            <Flex direction="column" gap="4">
              <FormField
                control={form.control}
                name="bet"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel htmlFor="bet">Bet:</FormLabel>
                      <FormControl>
                        <TextFieldInput
                          type="number"
                          min={0}
                          max={account.chipsAmount}
                          {...field}
                          value={field.value.toString()}
                          onChange={(e) => {
                            field.onChange({
                              target: {
                                value: Number(e.target.value),
                              },
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="planesNum"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel htmlFor="planesNum">Planes Num:</FormLabel>
                      <FormControl>
                        <TextFieldInput
                          disabled
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange({
                              targe: {
                                value: Number(e.target.value),
                              },
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="playgroundSize"
                render={({ field }) => {
                  const valueStr = field.value.join("*");
                  const onValueChange = (value: string) => {
                    const [x, y] = value.split("*").map((v) => parseInt(v));
                    field.onChange({
                      target: {
                        value: [x, y],
                      },
                    });
                  };
                  return (
                    <FormItem>
                      <FormLabel htmlFor="bet">Playground Size:</FormLabel>
                      <FormControl>
                        <RadioGroup.Root
                          disabled
                          value={valueStr}
                          onValueChange={onValueChange}
                        >
                          <Flex align="center" gap="2">
                            <RadioGroup.Item value="16*16" />
                            16 x 16
                          </Flex>
                        </RadioGroup.Root>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </Flex>
          </Form>
          <Flex gap="3" justify="end" mt="4">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                disabled={createRoomMutation.isPending}
                onClick={form.handleSubmit(async (data) => {
                  createRoomMutation.mutate(data);
                })}
              >
                {createRoomMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    );
  } else {
    return <Button disabled>Create Room</Button>;
  }
};
