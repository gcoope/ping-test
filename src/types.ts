import type { Edge, Node } from "@xyflow/react";

export type SkillNodeStatus = "locked" | "unlockable" | "unlocked";

export interface SkillNode extends Node {
  data: {
    id: string;
    label: string;
    status: SkillNodeStatus;
  };
}

export interface SkillEdge extends Edge {
  type: "skill";
}
