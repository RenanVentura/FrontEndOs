import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RegisterUserDialog from "../components/registers/registerUser";
import RegisterFilialDialog from "../components/registers/registerFilial";
import RegisterEquipmentDialog from "../components/registers/registerEquipment";
import RegisterEquipmentCategoryDialog from "../components/registers/registerEquipmentCategory";
import { useNavigate } from "react-router-dom";

const Card = ({ title, onClick }) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div
      className="border border-gray-300 p-5 m-2 text-center rounded-xl shadow-md hover:shadow-lg hover:scale-105 bg-gray-100 cursor-pointer transition duration-200"
      onClick={onClick}
    >
      <h3 className="text-gray-800 mb-4 text-lg font-semibold">{title}</h3>
      <button
        className={`bg-green-600 text-white px-6 py-2 rounded-md text-base transition duration-300 ${
          isButtonHovered ? "bg-green-700" : ""
        }`}
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
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nivel");
    navigate("/");
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

  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="font-sans bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20">
        <div className="flex justify-end p-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition duration-300"
          >
            Sair
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          CADASTRO
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto">
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
            title="CADASTRO DE CATEGORIA DE EQUIPAMENTOS"
            onClick={() => openDialog("CATEGORIA DE EQUIPAMENTOS")}
          />
        </div>
      </main>{" "}
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
      {activeDialog === "CADASTRO DE EQUIPAMENTOS" && (
        <RegisterEquipmentDialog
          open={true}
          onClose={closeDialog}
          onSubmit={handleSubmit}
        />
      )}
      {activeDialog === "CATEGORIA DE EQUIPAMENTOS" && (
        <RegisterEquipmentCategoryDialog
          open={true}
          onClose={closeDialog}
          onSubmit={handleSubmit}
        />
      )}
      {/* Modal genérico */}
      {activeDialog &&
        ![
          "CADASTRO DE USUÁRIOS",
          "CADASTRO DE FILIAIS",
          "CADASTRO DE EQUIPAMENTOS",
          "CATEGORIA DE EQUIPAMENTOS",
        ].includes(activeDialog) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-md w-11/12 max-w-md text-center shadow-lg">
              <h2 className="text-xl font-semibold mb-4">{modalTitle}</h2>
              <p className="mb-6">
                Funcionalidade de {modalTitle.toLowerCase()} em desenvolvimento
              </p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition"
                onClick={closeDialog}
              >
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
