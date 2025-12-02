import {
  ReactFlow,
  applyNodeChanges,
  type NodeChange,
  type Node,
  type Connection,
  type Edge,
  type EdgeChange,
  applyEdgeChanges,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useNodes } from "./context/nodes/index.tsx";
import { AddNodeForm } from "./components/AddNodeForm.tsx";
import { useEffect, useCallback } from "react";
import { SearchNodes } from "./components/SearchNodes.tsx";

import "./App.css";
import { SkillNodeComponent } from "./components/SkillNodeComponent.tsx";
import type { SkillNode } from "./types.ts";

const nodeTypes = {
  skillNodeComponent: SkillNodeComponent,
};

const App = () => {
  const {
    nodes,
    setNodes,
    addNode,
    edges,
    setEdges,
    addEdge,
    removeNodes,
    removeEdges,
  } = useNodes();

  // Prompts to delete any nodes that are selected
  const deleteSelected = useCallback(() => {
    const selectedNodeIds = nodes
      .filter((node) => node.selected)
      .map((node) => node.id);

    const selectedEdgeIds = edges
      .filter((edge) => edge.selected)
      .map((edge) => edge.id);

    if (selectedNodeIds.length > 0 || selectedEdgeIds.length > 0) {
      if (
        confirm("Are you sure you want to delete the selected nodes/edges?")
      ) {
        removeNodes(selectedNodeIds);
        removeEdges(selectedEdgeIds);
      }
    }
  }, [nodes, removeNodes, removeEdges, edges]);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        deleteSelected();
      }
    };

    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [deleteSelected]);

  const onNodesChange = (changes: NodeChange<Node>[]) => {
    changes.forEach((change) => {
      switch (change.type) {
        // case "add":
        //   addNode(change.item as SkillNode);
        //   break;
        // case "remove":
        //   removeNode(change.id);
        //   break;
        case "select":
          // console.log("selected", change.id, change.selected);
          break;
      }
    });
    setNodes(applyNodeChanges(changes, nodes) as SkillNode[]);
  };

  const onEdgesChange = (changes: EdgeChange<Edge>[]) => {
    setEdges(applyEdgeChanges(changes, edges) as Edge[]);
  };

  const onNodeconnect = (connection: Connection) => {
    addEdge({
      id: `${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
    });
  };

  return (
    <>
      <header className="app-header">
        <AddNodeForm addNode={addNode} />
        <SearchNodes />
      </header>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          colorMode="dark"
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onNodeconnect}
          fitView
        />
      </div>
    </>
  );
};

export default App;
