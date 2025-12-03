import { fireEvent, render, screen } from "@testing-library/react";
import { AddNodeForm } from "./AddNodeForm";
import { vi } from "vitest";
import { SkillNodeStatus } from "../../types";

describe("AddNodeForm", () => {
  it("renders correctly", () => {
    render(<AddNodeForm addNode={vi.fn()} />);
    expect(screen.getByText("Add Skill")).toBeInTheDocument();
  });

  it("should call addNode when the form is submitted with a valid skill name", () => {
    const skillName = "Test Skill";
    const addNode = vi.fn();
    render(<AddNodeForm addNode={addNode} />);
    fireEvent.change(screen.getByTestId("add-node-input"), {
      target: { value: skillName },
    });
    fireEvent.click(screen.getByTestId("add-node-button"));
    expect(addNode).toHaveBeenCalledWith({
      id: expect.any(String),
      data: {
        id: expect.any(String),
        label: skillName,
        status: SkillNodeStatus.Unlockable,
      },
      type: "skillNodeComponent",
      position: { x: 0, y: 0 },
    });
  });

  it("should not call addNode when the form is submitted with an empty skill name", () => {
    const addNode = vi.fn();
    render(<AddNodeForm addNode={addNode} />);
    fireEvent.click(screen.getByTestId("add-node-button"));
    expect(addNode).not.toHaveBeenCalled();
  });
});
