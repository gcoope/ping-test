import type { Node } from "@xyflow/react";

export const SkillNodeStatus = {
  Locked: "locked",
  Unlockable: "unlockable",
  Unlocked: "unlocked",
} as const;

export type SkillNodeStatus =
  (typeof SkillNodeStatus)[keyof typeof SkillNodeStatus];

export interface SkillNode extends Node {
  data: {
    id: string;
    label: string;
    status: SkillNodeStatus;
  };
}
