import type { SkillNode } from "../types.ts";
import type { Edge } from "@xyflow/react";
import { isChildOfNestedTarget } from "../utils/edges.ts";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Validates if a node can be added to the skill tree
export const validateAddNode = (
  newNode: SkillNode,
  existingNodes: SkillNode[]
): ValidationResult => {
  if (existingNodes.some((node) => node.id === newNode.id)) {
    return {
      isValid: false,
      error: "Skill with this ID already exists",
    };
  }

  if (existingNodes.some((node) => node.data.label === newNode.data.label)) {
    return {
      isValid: false,
      error: "A skill with this name already exists",
    };
  }

  return { isValid: true };
};

// Validates if an edge can be added to the skill tree
export const validateAddEdge = (
  edge: Edge,
  nodes: SkillNode[],
  edges: Edge[]
): ValidationResult => {
  const sourceNode = nodes.find((node) => node.id === edge.source);
  const targetNode = nodes.find((node) => node.id === edge.target);

  if (!sourceNode || !targetNode) {
    return {
      isValid: false,
      error: "Source or target node not found",
    };
  }

  if (edge.source === edge.target) {
    return {
      isValid: false,
      error: "Cannot link a skill to itself",
    };
  }

  if (edges.find((e) => e.id === `${edge.target}-${edge.source}`)) {
    return {
      isValid: false,
      error: "Target skill is already linked to this skill",
    };
  }

  if (edges.some((e) => e.id === edge.id)) {
    return {
      isValid: false,
      error: "This link already exists",
    };
  }

  // Prevent cycles by checking if the source node is a child of a nested target
  if (isChildOfNestedTarget(sourceNode.id, targetNode.id, edges)) {
    return {
      isValid: false,
      error: "Cannot link skill to a nested target",
    };
  }

  return { isValid: true };
};
