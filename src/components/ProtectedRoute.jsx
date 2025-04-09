import React from "react";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, minNivel }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const nivel = decoded.nivel;

    if (nivel < minNivel) {
      alert("Acesso negado. Você não tem permissão para acessar esta página.");
      window.location.href = "/";
      return null;
    }

    return children;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    window.location.href = "/";
    return null;
  }
};

export default ProtectedRoute;
