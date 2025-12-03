import { isChildOfNestedTarget } from "./edges";
import type { Edge } from "@xyflow/react";

describe("edges", () => {
  it("should return true if the target node is nested source", () => {
    const edges: Edge[] = [
      { id: "B-A", source: "B", target: "A" },
      { id: "C-B", source: "C", target: "B" },
    ];

    /**
     * Check for trying to connect A -> C
     * A
     * |
     * B
     * |
     * C
     */

    expect(isChildOfNestedTarget("A", "C", edges)).toBe(true);
  });

  it("should return true if the target node is a nested source where a node has multiple children", () => {
    const edges: Edge[] = [
      { id: "B-A", source: "B", target: "A" },
      { id: "C-B", source: "C", target: "B" },
      { id: "D-B", source: "D", target: "B" },
      { id: "E-B", source: "E", target: "B" },
    ];

    /**
     * Check for trying to connect A -> E
     *   A
     *   |
     *   B
     * / | \
     * C D E
     */
    expect(isChildOfNestedTarget("A", "E", edges)).toBe(true);
  });

  it("should return false if the target node is not a nested source", () => {
    const edges: Edge[] = [
      { id: "B-A", source: "B", target: "A" },
      { id: "D-C", source: "D", target: "C" },
    ];

    /**
     * Check for trying to connect A -> D
     *   A
     *   |
     *   B  C
     *      |
     *      D
     */
    expect(isChildOfNestedTarget("A", "D", edges)).toBe(false);
  });
});
