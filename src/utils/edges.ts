import type { Edge } from "@xyflow/react";

// Recursively check if a source node is a child of a nested target
// E.g. We have nodes A -> B -> C,  we try to link A -> C, we should return true a C is nested
export const isChildOfNestedTarget = (
  sourceNodeId: string,
  targetNodeId: string,
  edges: Edge[]
): boolean => {
  const targetTargets = edges
    .filter((e) => e.source === targetNodeId)
    .map((e) => e.target);
  return targetTargets.some(
    (t) => t === sourceNodeId || isChildOfNestedTarget(sourceNodeId, t, edges)
  );
};
