import {
  Handle,
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import classNames from "classnames";

import "./SkillNodeComponent.css";
import type { SkillNode } from "../../types.ts";
import { SkillNodeStatus } from "../../types.ts";
import { useNodes } from "../../context/NodesContext.tsx";
import { useEffect, useMemo } from "react";

type SkillNodeData = Pick<SkillNode["data"], "id" | "label" | "status">;

type SkillNodeType = Node<SkillNodeData, "skillNodeComponent">;

export const SkillNodeComponent = ({ data }: NodeProps<SkillNodeType>) => {
  const { nodes, setNodeStatus } = useNodes();

  const sourceConnections = useNodeConnections({
    handleType: "target",
  });

  // Array of the skills that are prerequisites for this skill
  const prereqs: SkillNodeData[] = useMemo(() => {
    return nodes
      .filter((n) => sourceConnections.some((s) => s.source === n.id))
      .map((n) => n.data);
  }, [sourceConnections, nodes]);

  const progress = useMemo(
    () => prereqs.filter((pr) => pr.status === SkillNodeStatus.Unlocked).length,
    [prereqs]
  );

  useEffect(() => {
    if (progress === prereqs.length && data.status === SkillNodeStatus.Locked) {
      setNodeStatus(data.id, SkillNodeStatus.Unlockable);
    }
    if (
      prereqs.length > 0 &&
      progress < prereqs.length &&
      data.status === SkillNodeStatus.Unlockable
    ) {
      setNodeStatus(data.id, SkillNodeStatus.Locked);
    }
  }, [prereqs, progress, data.id, data.status, setNodeStatus]);

  return (
    <div className={classNames("skill-node", data.status)}>
      <div className="skill-node-title">{data.label}</div>
      {prereqs.length > 0 && progress < prereqs.length && (
        <div className="skill-node-progress">
          Progress: {progress} / {prereqs.length}
        </div>
      )}
      {data.status === SkillNodeStatus.Unlockable &&
        progress === prereqs.length && (
          <button
            className="skill-node-button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent React Flow stealing our click event
              setNodeStatus(data.id, SkillNodeStatus.Unlocked);
            }}
            aria-label="Unlock skill"
          >
            Unlock
          </button>
        )}
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
};
