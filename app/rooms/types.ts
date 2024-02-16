import type { Address } from "@/types/web3";

export enum ROOM_STATUS {
  CREATED = 1,
  CONFIRMED = 2,
  STARTED = 3,
  LOCKED = 4,
  END = 5,
  ARCHIVED = 6,
}

export enum AttackResult {
  NONE = 1,
  BODY = 2,
  HEAD = 3,
}

export interface RoomDetail {
  id: string;
  status: ROOM_STATUS;
  bet: number;
  playgroundSize: [number, number];
  planesNum: number;
  players: {
    owner: Address;
    guest?: Address; // confirmed后才有值
    first?: Address; // started后有值
    winner?: Address; // end后有值
    lockedBy?: Address;
  };
  // 只有房间状态为started之后才有值，否则为空数组
  rounds: Array<{
    // 当postion为[-1, -1]时，表示用户超时未攻击
    position: [number, number];
    result: AttackResult;
    // 攻击者地址
    attacker: Address;
  }>;
}
