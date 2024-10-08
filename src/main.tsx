import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import FPSStats from "react-fps-stats";
import DeephavenApp from "./deephaven-grid/App.tsx";
import AgGridApp from "./ag-grid/App.tsx";
import GlideGridApp from "./glide-grid/App.tsx";
import RegularTableApp from "./regular-table/App.tsx";
import DirectCanvasApp from "./direct-canvas/App.tsx";
import CanvasImage from "./canvas-image/App.tsx";

import "./index.css";

const router = createHashRouter([
  {
    path: "/",
    element: <DeephavenApp />,
  },
  {
    path: "/ag-grid",
    element: <AgGridApp />,
  },
  {
    path: "/glide-grid",
    element: <GlideGridApp />,
  },
  {
    path: "/regular-table",
    element: <RegularTableApp />,
  },
  {
    path: "/direct-canvas",
    element: <DirectCanvasApp />,
  },
  {
    path: "/canvas-image",
    element: <CanvasImage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <>
    <FPSStats />
    <RouterProvider router={router} />
  </>
);
