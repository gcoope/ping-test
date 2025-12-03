import { createContext, useContext, useState } from "react";
import type { SkillNode } from "../types.ts";
import { SkillNodeStatus } from "../types.ts";
import type { Edge } from "@xyflow/react";
import { useLocalStorageSync } from "../hooks/useLocalStorageSync.ts";
import {
  validateAddNode,
  validateAddEdge,
} from "../services/skillTreeValidation.ts";
import { computeTargetStatusFromSource } from "../services/skillTreeStatus.ts";
import { calculateNewNodePosition } from "../services/skillTreeHelpers.ts";

interface NodesContextType {
  nodes: SkillNode[];
  initialNodes?: SkillNode[];
  setNodes: (nodes: SkillNode[]) => void;
  addNode: (node: SkillNode) => void;
  removeNodes: (ids: string[]) => void;

  edges: Edge[];
  initialEdges?: Edge[];
  addEdge: (edge: Edge) => void;
  setEdges: (edges: Edge[]) => void;
  removeEdges: (ids: string[]) => void;

  selectAll: () => void;
  setNodeStatus: (id: string, status: SkillNodeStatus) => void;
}

export const NodesContext = createContext<NodesContextType | undefined>(
  undefined
);

// NodesProvider is used to manage the node and edge state
export const NodesProvider = ({
  children,
  initialNodes,
  initialEdges,
}: {
  children: React.ReactNode;
  initialNodes?: SkillNode[];
  initialEdges?: Edge[];
}) => {
  const [nodes, setNodes] = useState<SkillNode[]>(initialNodes || []);
  const [edges, setEdges] = useState<Edge[]>(initialEdges || []);

  // Sync our node and edge state with localStorage
  useLocalStorageSync<SkillNode>("nodes", nodes, setNodes);
  useLocalStorageSync<Edge>("edges", edges, setEdges);

  // Validate then create a new node (skill)
  const addNode = (newNode: SkillNode) => {
    const validation = validateAddNode(newNode, nodes);

    if (!validation.isValid) {
      if (validation.error === "A skill with this name already exists") {
        alert(validation.error);
      } else {
        console.warn(validation.error);
      }
      return;
    }

    const position = calculateNewNodePosition(newNode, nodes);

    setNodes((prevNodes) => [
      ...prevNodes,
      {
        ...newNode,
        position,
      },
    ]);
  };

  // Remove nodes and any associated edges by their ids
  const removeNodes = (ids: string[]) => {
    setNodes((prevNodes) => prevNodes.filter((node) => !ids.includes(node.id)));
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => !ids.includes(edge.source) && !ids.includes(edge.target)
      )
    );
  };

  // Remove edges by their ids
  const removeEdges = (ids: string[]) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => !ids.includes(edge.id)));
  };

  // Validate then create a new edge connection
  const addEdge = (edge: Edge) => {
    const validation = validateAddEdge(edge, nodes, edges);

    if (!validation.isValid) {
      if (
        validation.error === "Cannot link a skill to itself" ||
        validation.error === "Cannot link skill to a nested target"
      ) {
        alert(validation.error);
      } else {
        console.warn(validation.error);
      }
      return;
    }

    const sourceNode = nodes.find((node) => node.id === edge.source);
    if (!sourceNode) {
      return; // Should not happen after validation, but TypeScript safety
    }

    // Compute the new status for the target node based on source status
    const newTargetStatus = computeTargetStatusFromSource(
      sourceNode.data.status
    );

    // Update the target node's status
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === edge.target
          ? { ...node, data: { ...node.data, status: newTargetStatus } }
          : node
      )
    );

    // Add the new edge
    setEdges((prevEdges) => [...prevEdges, edge]);
  };

  const selectAll = () => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({ ...node, selected: true }))
    );
    setEdges((prevEdges) =>
      prevEdges.map((edge) => ({ ...edge, selected: true }))
    );
  };

  const setNodeStatus = (id: string, status: SkillNodeStatus) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...node.data, status: status },
            }
          : node
      )
    );
  };

  return (
    <NodesContext.Provider
      value={{
        nodes,
        setNodes,
        addNode,
        removeNodes,
        removeEdges,
        edges,
        setEdges,
        addEdge,
        selectAll,
        setNodeStatus,
      }}
    >
      {children}
    </NodesContext.Provider>
  );
};

// Convenience hook to access this context
export const useNodes = (): NodesContextType => {
  const context = useContext(NodesContext);
  if (!context) {
    throw new Error("useNodes must be used within a NodesProvider");
  }
  return context;
};
