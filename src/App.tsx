import {
  ReactFlow,
  applyNodeChanges,
  type NodeChange,
  type Node,
  type Connection,
  type Edge,
  type EdgeChange,
  applyEdgeChanges,
  useKeyPress,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useNodes } from "./context/NodesContext.tsx";
import { AddNodeForm } from "./components/AddNodeForm/AddNodeForm.tsx";
import { useEffect, useCallback } from "react";
import { SkillsSearch } from "./components/SkillsSearch/SkillsSearch.tsx";

import "./App.css";
import { SkillNodeComponent } from "./components/SkillNodeComponent/SkillNodeComponent.tsx";
import type { SkillNode } from "./types.ts";
import { useSelectedItems } from "./hooks/useSelectedItems.ts";
import { skillTreeTemplate } from "./utils/templates.ts";

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
    selectAll,
  } = useNodes();

  const { nodeIds, edgeIds } = useSelectedItems();

  // Prompts to delete any nodes that are selected
  const deleteSelected = useCallback(() => {
    if (nodeIds.length > 0 || edgeIds.length > 0) {
      if (
        confirm("Are you sure you want to delete the selected nodes/edges?")
      ) {
        removeNodes(nodeIds);
        removeEdges(edgeIds);
      }
    }
  }, [nodeIds, edgeIds, removeNodes, removeEdges]);

  const ctrlAPressed = useKeyPress(["Control+a", "Meta+a"]);
  const delPressed = useKeyPress("Delete");

  useEffect(() => {
    if (delPressed) {
      deleteSelected();
    }

    if (ctrlAPressed) {
      selectAll();
    }
  }, [delPressed, deleteSelected, ctrlAPressed, selectAll]);

  const onNodesChange = (changes: NodeChange<Node>[]) => {
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
        <button
          onClick={() => {
            setNodes(skillTreeTemplate.nodes as SkillNode[]);
            setEdges(skillTreeTemplate.edges as Edge[]);
          }}
        >
          Load Demo
        </button>
        <SkillsSearch />
      </header>
      <div style={{ width: "100%", height: "98vh" }}>
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
      <footer className="app-footer">
        <p>
          <span className="app-footer-key">Ctrl/Cmd + A</span> to select all.{" "}
          <span className="app-footer-key">Del</span> to delete selection.{" "}
          <span className="app-footer-key">Ctrl/Cmd + K</span> to search.{" "}
        </p>
      </footer>
    </>
  );
};

export default App;
