import type { Edge } from "@xyflow/react";
import type { SkillNode } from "../types";
import { SkillNodeStatus } from "../types";

export const getTestNode = (
  id?: string,
  label?: string,
  status?: SkillNodeStatus
): SkillNode => {
  const nodeId = id || crypto.randomUUID();
  return {
    id: nodeId,
    data: {
      id: nodeId,
      label: label || "Test Skill",
      status: status || SkillNodeStatus.Unlockable,
    },
    position: { x: 0, y: 0 },
    type: "skillNodeComponent",
  };
};

export const getTestEdge = (source: string, target: string): Edge => {
  return {
    id: crypto.randomUUID(),
    source,
    target,
  };
};
