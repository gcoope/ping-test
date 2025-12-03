import { cleanup } from "@testing-library/react";
// This import ensures all jest-dom matchers are available globally in your tests
import "@testing-library/jest-dom";

// Runs cleanup after each test to unmount components and clear the DOM
// Using global afterEach since globals: true is enabled
afterEach(() => {
  cleanup();
});
