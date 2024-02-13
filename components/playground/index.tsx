import { Playground as PlaygroundComponent } from "./playground";
import { AttackEnemy } from "./attack-enemy";
import { WithstandAttack } from "./withstand-attack";
import { PlacePlane } from "./place-plane";

type PlaygroundComponentType = typeof PlaygroundComponent & {
  AttackEnemy: typeof AttackEnemy;
  WithstandAttack: typeof WithstandAttack;
  PlacePlane: typeof PlacePlane;
};

export const Playground: PlaygroundComponentType =
  PlaygroundComponent as PlaygroundComponentType;

Playground.AttackEnemy = AttackEnemy;
Playground.WithstandAttack = WithstandAttack;
Playground.PlacePlane = PlacePlane;
