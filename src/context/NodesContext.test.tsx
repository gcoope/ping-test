import { renderHook, act } from "@testing-library/react";
import { useNodes, NodesProvider } from "./NodesContext";
import type { SkillNode } from "../types";
import type { Edge } from "@xyflow/react";
import { getTestNode } from "../tests/data";

// Wrapper component to provide the context
const wrapper = ({
  children,
  initialNodes,
  initialEdges,
}: {
  children?: React.ReactNode;
  initialNodes?: SkillNode[];
  initialEdges?: Edge[];
}) => (
  <NodesProvider initialNodes={initialNodes} initialEdges={initialEdges}>
    {children}
  </NodesProvider>
);

// Mock the useLocalStorageSync hook so we don't actually write to localStorage
vi.mock("../hooks/useLocalStorageSync", () => ({
  useLocalStorageSync: vi.fn(),
}));

const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

describe("NodesContext", () => {
  describe("addNode", () => {
    it("should add a node", () => {
      const { result } = renderHook(() => useNodes(), { wrapper });
      expect(result.current.nodes).toHaveLength(0);

      act(() => {
        result.current.addNode(getTestNode("1"));
      });
      expect(result.current.nodes).toHaveLength(1);
      act(() => {
        result.current.removeNodes(["1"]);
      });
      expect(result.current.nodes).toHaveLength(0);
    });
  });

  describe("addEdge", () => {
    it("should add a valid edge", () => {
      const { result } = renderHook(() => useNodes(), {
        wrapper: ({ children }) =>
          wrapper({
            children,
            initialNodes: [getTestNode("A"), getTestNode("B")],
            initialEdges: [],
          }),
      });
      act(() => {
        result.current.addEdge({
          id: "A-B",
          source: "A",
          target: "B",
        });
      });
      expect(result.current.edges).toHaveLength(1);
    });

    it("should not add an invalid edge", () => {
      const { result } = renderHook(() => useNodes(), {
        wrapper: ({ children }) =>
          wrapper({
            children,
            initialNodes: [getTestNode("1", "Test Skill 1")],
            initialEdges: [],
          }),
      });
      const setNodesSpy = vi.spyOn(result.current, "setNodes");
      act(() => {
        result.current.addEdge({
          id: "1-2",
          source: "1",
          target: "2",
        });
      });
      expect(result.current.edges).toHaveLength(0);
      expect(setNodesSpy).not.toHaveBeenCalled();
    });

    it("should not allow linking to itself", () => {
      const { result } = renderHook(() => useNodes(), {
        wrapper: ({ children }) =>
          wrapper({
            children,
            initialNodes: [getTestNode("A")],
            initialEdges: [],
          }),
      });
      act(() => {
        result.current.addEdge({
          id: "A-A",
          source: "A",
          target: "A",
        });
      });
      expect(result.current.edges).toHaveLength(0);
      expect(alertSpy).toHaveBeenCalledWith("Cannot link a skill to itself");
    });
  });
});
