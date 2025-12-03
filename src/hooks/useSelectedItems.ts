import {
  useOnSelectionChange,
  type Edge,
  type Node,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import { useState, useCallback } from "react";

// Tidy way to get all the ids of selected nodes and edges
export const useSelectedItems = () => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  // the passed handler has to be memoized, otherwise the hook will not work correctly
  const onChange = useCallback(
    ({ nodes, edges }: OnSelectionChangeParams<Node, Edge>) => {
      setSelectedNodes(nodes.map((node) => node.id) as string[]);
      setSelectedEdges(edges.map((edge) => edge.id) as string[]);
    },
    []
  );

  useOnSelectionChange({
    onChange,
  });

  return { nodeIds: selectedNodes, edgeIds: selectedEdges };
};
