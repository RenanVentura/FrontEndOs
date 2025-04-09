import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function HubSolicitation() {
  const [solicitations, setSolicitations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);
      const nivel = decoded.nivel;
      const userName = decoded.name;

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await api.get("/solicitation", config);
        const allSolicitations = res.data;

        const filtered =
          nivel === 1
            ? allSolicitations.filter((sol) => sol.userName === userName)
            : allSolicitations;

        const ordered = filtered.sort((a, b) => b.numSol - a.numSol);
        setSolicitations(ordered);
      } catch (error) {
        console.error("Erro ao buscar solicitações:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nivel");
    window.location.href = "/";
  };

  // PAGINAÇÃO
  const totalPages = Math.ceil(solicitations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = solicitations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 relative">
        <div className="absolute left-4 top-4 flex gap-4">
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Sair
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 font-bold text-white px-4 py-2 rounded-lg transition-colors duration-300">
            Filtro
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8">
          Follow-up de Solicitações
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100 text-left text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-6 py-4">N° Solicitação</th>
                <th className="px-6 py-4">Filial</th>
                <th className="px-6 py-4">Solicitante</th>
                <th className="px-6 py-4">Serviço</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data de Criação</th>
                <th className="px-6 py-4">Urgência</th>
                <th className="px-6 py-4">Equipamento</th>
                <th className="px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((sol, index) => (
                <tr
                  key={sol.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">{sol.numSol}</td>
                  <td className="px-6 py-4">{sol.filial}</td>
                  <td className="px-6 py-4">{sol.userName}</td>
                  <td className="px-6 py-4">{sol.categoryService}</td>
                  <td className="px-6 py-4">{sol.status}</td>
                  <td className="px-6 py-4">
                    {new Date(sol.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        sol.urgency === "Crítico/Urgente"
                          ? "bg-red-600"
                          : sol.urgency === "Alta"
                          ? "bg-orange-500"
                          : sol.urgency === "Moderada"
                          ? "bg-yellow-400"
                          : "bg-green-500"
                      }`}
                    ></span>
                    {sol.urgency}
                  </td>
                  <td className="px-6 py-4">{sol.categoryEquipment}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/solicitacao/${sol.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white shadow-md px-4 py-2 rounded-xl flex gap-2 z-50">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => changePage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default HubSolicitation;
