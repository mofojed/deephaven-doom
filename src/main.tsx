import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import FPSStats from "react-fps-stats";
import DeephavenApp from "./deephaven-grid/App.tsx";
import AgGridApp from "./ag-grid/App.tsx";
import GlideGridApp from "./glide-grid/App.tsx";
import RegularTableApp from "./regular-table/App.tsx";

import "./index.css";

const router = createBrowserRouter([
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
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FPSStats />
    <RouterProvider router={router} />
  </React.StrictMode>
);
