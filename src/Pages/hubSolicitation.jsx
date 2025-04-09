import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function HubSolicitation() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 relative">
        {/* Buttons container */}
        <div className="absolute left-4 top-4 flex gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300">
            Filtro
          </button>
          <Link
            to="/"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Sair
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8">
          Follow-up de Solicitações
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            to="/nova-solicitacao"
            className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[250px]"
          >
            <h2 className="text-2xl font-semibold mb-4">Nova Solicitação</h2>
            <p className="text-gray-600 mb-4">
              Criar uma nova solicitação de serviço
            </p>
            <div className="mt-auto">{/* Espaço para dados adicionais */}</div>
          </Link>

          <Link
            to="/minhas-solicitacoes"
            className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[250px]"
          >
            <h2 className="text-2xl font-semibold mb-4">Minhas Solicitações</h2>
            <p className="text-gray-600 mb-4">
              Visualizar e acompanhar suas solicitações
            </p>
            <div className="mt-auto">{/* Espaço para dados adicionais */}</div>
          </Link>

          <Link
            to="/solicitacoes-pendentes"
            className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[250px]"
          >
            <h2 className="text-2xl font-semibold mb-4">
              Solicitações Pendentes
            </h2>
            <p className="text-gray-600 mb-4">
              Verificar solicitações que precisam de atenção
            </p>
            <div className="mt-auto">{/* Espaço para dados adicionais */}</div>
          </Link>

          <Link
            to="/historico-solicitacoes"
            className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[250px]"
          >
            <h2 className="text-2xl font-semibold mb-4">Histórico</h2>
            <p className="text-gray-600 mb-4">
              Acessar histórico completo de solicitações
            </p>
            <div className="mt-auto">{/* Espaço para dados adicionais */}</div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HubSolicitation;
