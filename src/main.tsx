import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { NodesProvider } from "./context/NodesContext.tsx";
import { ReactFlowProvider } from "@xyflow/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactFlowProvider>
      <NodesProvider>
        <App />
      </NodesProvider>
    </ReactFlowProvider>
  </StrictMode>
);
