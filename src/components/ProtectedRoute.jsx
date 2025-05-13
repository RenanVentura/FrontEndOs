import React from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, minNivel }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    // window.location.href = "/";
    navigate("/");
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const nivel = decoded.nivel;

    if (nivel < minNivel) {
      alert("Acesso negado. Você não tem permissão para acessar esta página.");
      // window.location.href = "/";
      navigate("/");

      return null;
    }

    return children;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    navigate("/");
    // window.location.href = "/";
    return null;
  }
};

export default ProtectedRoute;
