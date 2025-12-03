import { createContext, useContext, useCallback } from "react";
import { useNodes } from "./NodesContext.tsx";

interface SearchContextType {
  searchNodes: (search: string) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);

// SearchProvider is used to search and highlight nodes by label
export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const { nodes, edges, setNodes, setEdges } = useNodes();

  const clearNodeHighlights = useCallback(() => {
    const clearedNodes = nodes.map((node) => ({ ...node, className: "" }));
    const clearedEdges = edges.map((edge) => ({ ...edge, className: "" }));
    setNodes(clearedNodes);
    setEdges(clearedEdges);
  }, [nodes, edges, setNodes, setEdges]);

  // Search and highlight nodes by label (case insensitive)
  // Edges between highlighted nodes are also highlighted
  const searchNodes = useCallback(
    (search: string) => {
      // If search is clear, clear all highlights
      if (search.trim() === "") {
        clearNodeHighlights();
        return;
      }

      const filteredNodes = nodes.filter((node) =>
        (node.data.label as string).toLowerCase().includes(search.toLowerCase())
      );

      if (filteredNodes.length > 0) {
        const highlightedNodeIds = new Set(
          filteredNodes.map((node) => node.id)
        );

        // Highlight matching nodes
        const highlightedNodes = nodes.map((node) =>
          highlightedNodeIds.has(node.id)
            ? { ...node, className: "highlight" }
            : { ...node, className: "" }
        );

        // Highlight edges connected to highlighted nodes
        const highlightedEdges = edges.map((edge) =>
          highlightedNodeIds.has(edge.source) &&
          highlightedNodeIds.has(edge.target)
            ? { ...edge, className: "highlight" }
            : { ...edge, className: "" }
        );

        setNodes(highlightedNodes);
        setEdges(highlightedEdges);
      } else {
        // No matches found, clear all highlights
        clearNodeHighlights();
      }
    },
    [nodes, edges, setNodes, setEdges, clearNodeHighlights]
  );

  return (
    <SearchContext.Provider value={{ searchNodes }}>
      {children}
    </SearchContext.Provider>
  );
};

// Convenience hook to access this context
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
