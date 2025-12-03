import type { SkillNode } from "../types.ts";

// Calculates the Y position for a new node based on existing nodes
// Places it below the lowest existing node
const NODE_HEIGHT_OFFSET = 60; // Magic number as we can't get node height from React Flow

export const calculateNewNodePosition = (
  newNode: SkillNode,
  existingNodes: SkillNode[]
): { x: number; y: number } => {
  if (existingNodes.length === 0) {
    return newNode.position;
  }

  const lowestNode = existingNodes.reduce(
    (min, node) => (node.position.y > min.position.y ? node : min),
    existingNodes[0]
  );

  return {
    x: newNode.position.x,
    y: lowestNode.position.y + NODE_HEIGHT_OFFSET,
  };
};

// Removes edges that are connected to any of the specified node IDs
// Returns edge IDs or generates them from source-target pairs
export const getEdgesToRemoveForNodes = (
  nodeIds: string[],
  edges: Array<{ source: string; target: string; id?: string }>
): string[] => {
  return edges
    .filter(
      (edge) => nodeIds.includes(edge.source) || nodeIds.includes(edge.target)
    )
    .map((edge) => edge.id || `${edge.source}-${edge.target}`);
};
