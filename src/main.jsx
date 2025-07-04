import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Solicitation from "./Pages/Solicitation.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HubSolicitation from "./Pages/hubSolicitation.jsx";
import Register from "./Pages/register.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/solicitation"
          element={
            <ProtectedRoute minNivel={1}>
              <Solicitation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hubsolicitation"
          element={
            <ProtectedRoute minNivel={1}>
              <HubSolicitation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute minNivel={2}>
              <Register />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
