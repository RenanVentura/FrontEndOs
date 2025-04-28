import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Card = ({ title, link }) => (
  <div
    style={{
      border: "1px solid #ddd",
      padding: "20px",
      margin: "10px",
      textAlign: "center",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
      transition: "transform 0.2s, box-shadow 0.2s",
      backgroundColor: "#f9f9f9",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.15)";
    }}
  >
    <h3 style={{ color: "#333", marginBottom: "15px" }}>{title}</h3>
    <Link to={link} style={{ textDecoration: "none" }}>
      <button
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "12px 25px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
      >
        Cadastrar
      </button>
    </Link>
  </div>
);

const Register = () => {
  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        backgroundColor: "#f4f4f9",
        minHeight: "100vh",
      }}
    >
      <Header />
      <h1
        className="text-center mt-5 text-3xl text-shadow-black"
        style={{
          color: "#333",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
          marginBottom: "30px",
        }}
      >
        CADASTRO
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Card title="CADASTRO DE USUÁRIOS" link="/cadastro-usuarios" />
        <Card title="CADASTRO DE FILIAIS" link="/cadastro-filiais" />
        <Card title="CADASTRO DE EQUIPAMENTOS" link="/cadastro-equipamentos" />
        <Card
          title="CATEGORIA DE EQUIPAMENTOS"
          link="/categoria-equipamentos"
        />
      </div>
      <Footer />
    </div>
  );
};

export default Register;
