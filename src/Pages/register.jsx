import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RegisterUserDialog from "../components/registers/registerUser";
import RegisterFilialDialog from "../components/registers/registerFilial";

// Estilos extraídos para constantes
const cardStyle = {
  border: "1px solid #ddd",
  padding: "20px",
  margin: "10px",
  textAlign: "center",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
  transition: "transform 0.2s, box-shadow 0.2s",
  backgroundColor: "#f9f9f9",
  cursor: "pointer",
};

const cardHoverStyle = {
  transform: "scale(1.05)",
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "12px 25px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "background-color 0.3s",
};

const buttonHoverStyle = {
  backgroundColor: "#45a049",
};

const logoutButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#f44336",
};

const logoutButtonHoverStyle = {
  backgroundColor: "#d32f2f",
};

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "8px",
  width: "80%",
  maxWidth: "500px",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
};

const modalButtonStyle = {
  ...buttonStyle,
  padding: "12px 24px",
};

const Card = ({ title, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div
      style={{
        ...cardStyle,
        ...(isHovered ? cardHoverStyle : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <h3 style={{ color: "#333", marginBottom: "15px" }}>{title}</h3>
      <button
        style={{
          ...buttonStyle,
          ...(isButtonHovered ? buttonHoverStyle : {}),
        }}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        Cadastrar
      </button>
    </div>
  );
};

const Register = () => {
  const [activeDialog, setActiveDialog] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nivel");
    window.location.href = "/";
  };

  const openDialog = (title) => {
    setModalTitle(title);
    setActiveDialog(title);
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setModalTitle("");
  };

  const handleSubmit = (data) => {
    console.log("Dados enviados:", data);
    closeDialog();
  };

  // Verifica se o usuário está autenticado
  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        backgroundColor: "#f4f4f9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <main
        style={{
          flex: 1,
          paddingBottom: "80px",
        }}
      >
        {/* Botão de Logout */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px 20px",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              ...logoutButtonStyle,
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
          >
            Logout
          </button>
        </div>

        <h1
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#333",
            fontWeight: "bold",
            marginBottom: "30px",
            fontSize: "2rem",
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
          <Card
            title="CADASTRO DE USUÁRIOS"
            onClick={() => openDialog("CADASTRO DE USUÁRIOS")}
          />
          <Card
            title="CADASTRO DE FILIAIS"
            onClick={() => openDialog("CADASTRO DE FILIAIS")}
          />
          <Card
            title="CADASTRO DE EQUIPAMENTOS"
            onClick={() => openDialog("CADASTRO DE EQUIPAMENTOS")}
          />
          <Card
            title="CATEGORIA DE EQUIPAMENTOS"
            onClick={() => openDialog("CATEGORIA DE EQUIPAMENTOS")}
          />
        </div>
      </main>

      {/* Diálogos específicos */}
      {activeDialog === "CADASTRO DE USUÁRIOS" && (
        <RegisterUserDialog
          open={true}
          onClose={closeDialog}
          onSubmit={handleSubmit}
        />
      )}

      {activeDialog === "CADASTRO DE FILIAIS" && (
        <RegisterFilialDialog
          open={true}
          onClose={closeDialog}
          onSubmit={handleSubmit}
        />
      )}

      {/* Modal genérico para outros cadastros */}
      {activeDialog &&
        activeDialog !== "CADASTRO DE USUÁRIOS" &&
        activeDialog !== "CADASTRO DE FILIAIS" && (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
              <h2 style={{ marginBottom: "20px" }}>{modalTitle}</h2>
              <p style={{ marginBottom: "30px" }}>
                Funcionalidade de {modalTitle.toLowerCase()} em desenvolvimento
              </p>
              <button style={modalButtonStyle} onClick={closeDialog}>
                Fechar
              </button>
            </div>
          </div>
        )}

      <Footer />
    </div>
  );
};

export default Register;
