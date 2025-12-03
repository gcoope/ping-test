import type { SkillNode } from "../types.ts";
import { SkillNodeStatus } from "../types.ts";
import type { Edge } from "@xyflow/react";

// Computes the status a target node should have based on the source node's status
// when creating a new edge
export const computeTargetStatusFromSource = (
  sourceStatus: SkillNodeStatus
): SkillNodeStatus => {
  switch (sourceStatus) {
    case SkillNodeStatus.Locked:
    case SkillNodeStatus.Unlockable:
      return SkillNodeStatus.Locked;
    case SkillNodeStatus.Unlocked:
      return SkillNodeStatus.Unlockable;
    default:
      return SkillNodeStatus.Locked;
  }
};

// Computes the status of a node based on its prerequisites
// Returns Unlockable if all prerequisites are unlocked, otherwise Locked
export const computeNodeStatusFromPrerequisites = (
  nodeId: string,
  nodes: SkillNode[],
  edges: Edge[]
): SkillNodeStatus => {
  const prerequisites = edges
    .filter((edge) => edge.target === nodeId)
    .map((edge) => nodes.find((node) => node.id === edge.source))
    .filter((node): node is SkillNode => node !== undefined);

  if (prerequisites.length === 0) {
    // No prerequisites, node can be unlockable
    return SkillNodeStatus.Unlockable;
  }

  const allPrerequisitesUnlocked = prerequisites.every(
    (prereq) => prereq.data.status === SkillNodeStatus.Unlocked
  );

  return allPrerequisitesUnlocked
    ? SkillNodeStatus.Unlockable
    : SkillNodeStatus.Locked;
};
