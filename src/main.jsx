import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Login from "./Pages/Login/Login.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Login />
  </StrictMode>
);
