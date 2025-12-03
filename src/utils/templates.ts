import type { SkillNode } from "../types";
import type { Edge } from "@xyflow/react";
import { SkillNodeStatus } from "../types";

// Grid layout constants
const GRID_X_SPACING = 250;
const GRID_Y_SPACING = 120;
const START_X = 0;
const START_Y = 0;

// Helper to create a node at grid position
const createNode = (
  id: string,
  label: string,
  status: SkillNodeStatus,
  gridX: number,
  gridY: number
): SkillNode => ({
  id,
  data: {
    id,
    label,
    status,
  },
  position: {
    x: START_X + gridX * GRID_X_SPACING,
    y: START_Y + gridY * GRID_Y_SPACING,
  },
  type: "skillNodeComponent",
});

// Helper to create an edge
const createEdge = (source: string, target: string): Edge => ({
  id: `${source}-${target}`,
  source,
  target,
});

export const skillTreeTemplate = {
  nodes: [
    // Row 0: Expert Skills (require advanced skills) - TOP
    createNode(
      "architecture",
      "System Architecture",
      SkillNodeStatus.Locked,
      -1,
      0
    ),
    createNode(
      "performance",
      "Performance Optimization",
      SkillNodeStatus.Locked,
      0,
      0
    ),
    createNode(
      "security",
      "Security Best Practices",
      SkillNodeStatus.Locked,
      1,
      0
    ),

    // Row 1: Advanced Skills (require multiple prerequisites)
    createNode("nextjs", "Next.js", SkillNodeStatus.Locked, -1, 1),
    createNode(
      "fullstack",
      "Full-Stack Development",
      SkillNodeStatus.Locked,
      0,
      1
    ),
    createNode("testing", "Testing & QA", SkillNodeStatus.Locked, 1, 1),
    createNode("devops", "DevOps", SkillNodeStatus.Locked, 2, 2),

    // Row 2: Intermediate Skills (require core skills)
    createNode("react", "React", SkillNodeStatus.Locked, -1, 2),
    createNode("nodejs", "Node.js", SkillNodeStatus.Locked, 0, 2),
    createNode("typescript", "TypeScript", SkillNodeStatus.Locked, 1, 2),
    createNode(
      "git",
      "Git & Version Control",
      SkillNodeStatus.Unlockable,
      2,
      3
    ),

    // Row 3: Core Skills (unlockable from foundation)
    createNode("html", "HTML Basics", SkillNodeStatus.Unlockable, -1, 3),
    createNode("css", "CSS Styling", SkillNodeStatus.Unlockable, 0, 3),
    createNode("js", "JavaScript", SkillNodeStatus.Unlockable, 1, 3),

    // Row 4: Foundation (Starting point - unlocked) - BOTTOM
    createNode("foundation", "Foundation", SkillNodeStatus.Unlocked, 0, 4),
  ],

  edges: [
    // Foundation -> Core Skills
    createEdge("foundation", "html"),
    createEdge("foundation", "css"),
    createEdge("foundation", "js"),
    createEdge("foundation", "git"),

    // Core Skills -> Intermediate Skills
    createEdge("html", "react"),
    createEdge("css", "react"),
    createEdge("js", "react"),
    createEdge("js", "nodejs"),
    createEdge("js", "typescript"),
    createEdge("html", "typescript"),
    createEdge("css", "typescript"),

    // Intermediate Skills -> Advanced Skills
    createEdge("react", "nextjs"),
    createEdge("typescript", "nextjs"),
    createEdge("react", "fullstack"),
    createEdge("nodejs", "fullstack"),
    createEdge("typescript", "fullstack"),
    createEdge("js", "testing"),
    createEdge("react", "testing"),
    createEdge("nodejs", "devops"),
    createEdge("git", "devops"),

    // Advanced Skills -> Expert Skills
    createEdge("nextjs", "architecture"),
    createEdge("fullstack", "architecture"),
    createEdge("fullstack", "performance"),
    createEdge("nextjs", "performance"),
    createEdge("nodejs", "performance"),
    createEdge("fullstack", "security"),
    createEdge("devops", "security"),
    createEdge("testing", "security"),
  ],
};
