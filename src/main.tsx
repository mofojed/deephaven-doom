import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DeephavenApp from "./deephaven-grid/App.tsx";
import AgGridApp from "./ag-grid/App.tsx";
import GlideGridApp from "./glide-grid/App.tsx";

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
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
