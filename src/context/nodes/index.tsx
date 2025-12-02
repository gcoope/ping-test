import { createContext, useContext, useState } from "react";
import type { SkillNode } from "../../types";
import type { Edge } from "@xyflow/react";
import { useLocalStorageSync } from "../../hooks/useLocalStorageSync.ts";

interface NodesContextType {
  nodes: SkillNode[];
  setNodes: (nodes: SkillNode[]) => void;
  addNode: (node: SkillNode) => void;
  removeNodes: (ids: string[]) => void;

  edges: Edge[];
  addEdge: (edge: Edge) => void;
  setEdges: (edges: Edge[]) => void;
  removeEdges: (ids: string[]) => void;

  searchNodes: (search: string) => void;

  unlockNode: (id: string) => void;
}

export const NodesContext = createContext<NodesContextType | undefined>(
  undefined
);

export const NodesProvider = ({ children }: { children: React.ReactNode }) => {
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Sync our node and edge state with localStorage
  useLocalStorageSync<SkillNode>("nodes", nodes, setNodes);
  useLocalStorageSync<Edge>("edges", edges, setEdges);

  // Validate then create a new node (skill)
  const addNode = (newNode: SkillNode) => {
    if (nodes.some((node) => node.id === newNode.id)) {
      console.warn("Skill with this ID already exists");
      return;
    }

    if (nodes.some((node) => node.data.label === newNode.data.label)) {
      alert("A skill with this name already exists");
      return;
    }

    let newNodePositionY = newNode.position.y;
    if (nodes.length > 0) {
      const lowestNode = nodes.reduce(
        (min, node) => (node.position.y > min.position.y ? node : min),
        nodes[0]
      );

      // Magic number as we can't seem to get the node height from React Flow
      newNodePositionY = lowestNode.position.y + 60;
    }

    setNodes((prevNodes) => [
      ...prevNodes,
      {
        ...newNode,
        position: {
          x: newNode.position.x,
          y: newNodePositionY,
        },
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
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);

    if (!sourceNode || !targetNode) {
      console.error("Source or target node not found");
      return;
    }

    if (edge.source === edge.target) {
      alert("Cannot link a skill to itself");
      return;
    }

    if (edges.find((e) => e.id === `${edge.target}-${edge.source}`)) {
      console.warn("Target skill is aleady linked to this skill");
      return;
    }

    if (edges.some((e) => e.id === edge.id)) {
      // Just in case...
      console.warn("This link already exists");
      return;
    }

    switch (sourceNode?.data.status) {
      case "locked":
      case "unlockable":
        targetNode.data.status = "locked";
        break;
      case "unlocked":
        targetNode.data.status = "unlockable";
        break;
    }

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === edge.target
          ? { ...node, data: { ...node.data, status: targetNode.data.status } }
          : node
      )
    );

    setEdges((prevEdges) => [...prevEdges, edge]);
  };

  // Search and highlight nodes/edges by label (case insensitive)
  const searchNodes = (search: string) => {
    // If search is clear, clear all highlights
    if (search.trim() === "") {
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({ ...node, className: "" }))
      );
      setEdges((prevEdges) =>
        prevEdges.map((edge) => ({ ...edge, className: "" }))
      );
      return;
    }

    const filteredNodes = nodes.filter((node) =>
      (node.data.label as string).toLowerCase().includes(search.toLowerCase())
    );

    if (filteredNodes.length > 0) {
      const highlightedNodeIds = new Set(filteredNodes.map((node) => node.id));

      // Highlight matching nodes
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          highlightedNodeIds.has(node.id)
            ? { ...node, className: "highlight" }
            : { ...node, className: "" }
        )
      );

      // Highlight edges connected to highlighted nodes
      setEdges((prevEdges) =>
        prevEdges.map((edge) =>
          highlightedNodeIds.has(edge.source) ||
          highlightedNodeIds.has(edge.target)
            ? { ...edge, className: "highlight" }
            : { ...edge, className: "" }
        )
      );
    } else {
      // No matches found, clear all highlights
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({ ...node, className: "" }))
      );
      setEdges((prevEdges) =>
        prevEdges.map((edge) => ({ ...edge, className: "" }))
      );
    }
  };

  const unlockNode = (id: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, status: "unlocked" } }
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
        searchNodes,
        unlockNode,
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
