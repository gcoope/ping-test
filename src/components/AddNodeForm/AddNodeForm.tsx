import { useState } from "react";
import type { SkillNode } from "../../types";
import { SkillNodeStatus } from "../../types";

import "./AddNodeForm.css";

export const AddNodeForm = ({
  addNode,
}: {
  addNode: (node: SkillNode) => void;
}) => {
  const [nodeName, setNodeName] = useState("");

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (nodeName.trim()) {
      const id = crypto.randomUUID();
      addNode({
        id,
        data: {
          id,
          label: nodeName.trim(),
          status: SkillNodeStatus.Unlockable,
        },
        type: "skillNodeComponent",
        position: { x: 0, y: 0 },
      });
      setNodeName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-node-form">
      <input
        className="add-node-input"
        data-testid="add-node-input"
        type="text"
        name="skill-name"
        placeholder="Enter skill name..."
        value={nodeName}
        onChange={(e) => setNodeName(e.target.value)}
      />
      <button
        className="add-node-button"
        data-testid="add-node-button"
        disabled={!nodeName.trim()}
        onClick={() => {
          handleSubmit();
        }}
      >
        Add Skill
      </button>
    </form>
  );
};
