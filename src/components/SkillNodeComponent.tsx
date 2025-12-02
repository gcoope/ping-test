import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import classNames from "classnames";

import "./SkillNodeComponent.css";
import type { SkillNodeStatus } from "../types";
import { useNodes } from "../context/nodes/index.tsx";

type SkillNodeData = {
  id: string;
  label: string;
  status: SkillNodeStatus;
};

type SkillNodeType = Node<SkillNodeData, "skillNodeComponent">;

export const SkillNodeComponent = ({ data }: NodeProps<SkillNodeType>) => {
  const { unlockNode } = useNodes();

  return (
    <div
      className={classNames("skill-node", { locked: data.status === "locked" })}
    >
      <div className="skill-node-title">{data.label}</div>
      {data.status === "locked" && (
        <button
          className="skill-node-button"
          onClick={() => unlockNode(data.id)}
        >
          Unlock
        </button>
      )}
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
};
