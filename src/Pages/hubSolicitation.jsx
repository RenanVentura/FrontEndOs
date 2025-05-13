import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { FaChevronLeft, FaChevronRight, FaFileExcel } from "react-icons/fa";
import SolicitationDialog from "../components/SolicitationDialog";
import FilterDialog from "../components/FilterDialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

function HubSolicitation() {
  const [allSolicitations, setAllSolicitations] = useState([]);
  const [filteredSolicitations, setFilteredSolicitations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSolicitation, setSelectedSolicitation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const itemsPerPage = 9;

  const navigate = useNavigate();

  const fetchSolicitations = async (params = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleLogout();
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const queryParams = new URLSearchParams();

      // Adiciona apenas parâmetros válidos (nem undefined, nem null, nem string vazia)
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v));
          } else {
            queryParams.append(key, value);
          }
        }
      });

      // Log para depuração
      console.log("Query enviada para API:", queryParams.toString());

      const res = await api.get(
        `/solicitation?deleted=false&${queryParams.toString()}`,
        config
      );

      const decoded = jwtDecode(token);
      let filtered = res.data;

      // Filtra por usuário se for nível 1
      if (decoded.nivel === 1) {
        filtered = filtered.filter((sol) => sol.userName === decoded.name);
      }

      // Ordena pela numeração da solicitação
      filtered = filtered.sort((a, b) => (b.numSol || 0) - (a.numSol || 0));

      setAllSolicitations(filtered);
      setFilteredSolicitations(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      alert("Erro ao carregar solicitações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitations();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleApplyFilters = (filters) => {
    const apiParams = {
      startDate: filters.startDate || null,
      endDate: filters.endDate || null,
      status: filters.status || null,
      requester: filters.requester || null,
      filial: filters.filial || null,
      urgency: filters.urgency || null,
    };
    const cleanedFilters = Object.fromEntries(
      Object.entries(apiParams).filter(([_, v]) => v)
    );
    fetchSolicitations(cleanedFilters);
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    fetchSolicitations();
    setAppliedFilters({});
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleExportToExcel = () => {
    if (!filteredSolicitations.length) {
      alert("Nenhum dado para exportar");
      return;
    }
    try {
      const dataToExport = filteredSolicitations.map(
        ({
          id,
          statusDelete,
          createdAt,
          atendedAt,
          updatedAt,
          numSol,
          filial,
          userName,
          categoryService,
          status,
          urgency,
          categoryEquipment,
          ...rest
        }) => ({
          "N° Solicitação": numSol,
          Filial: filial,
          Solicitante: userName,
          "Data de Criação": createdAt
            ? new Date(createdAt).toLocaleDateString("pt-BR")
            : "",
          "Data de Atendimento": atendedAt
            ? new Date(atendedAt).toLocaleDateString("pt-BR")
            : "",
          Serviço: categoryService,
          Status: status,
          Urgência: urgency,
          Equipamento: categoryEquipment,
          ...rest,
          "Última Atualização": updatedAt
            ? new Date(updatedAt).toLocaleDateString("pt-BR")
            : "",
        })
      );
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitações");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `solicitacoes_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error);
      alert("Erro ao exportar dados");
    }
  };

  const totalPages = Math.ceil(filteredSolicitations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredSolicitations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const changePage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderUrgencyBadge = (urgency) => {
    const urgencyColors = {
      "Crítico/Urgente": "bg-red-600",
      Alta: "bg-orange-500",
      Moderada: "bg-yellow-400",
      Baixa: "bg-green-500",
    };
    return (
      <div className="flex items-center gap-2">
        <span
          className={`w-3 h-3 rounded-full ${
            urgencyColors[urgency] || "bg-green-500"
          }`}
        />
        {urgency}
      </div>
    );
  };

  const renderDesktopTable = () => (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-100 text-left text-gray-700 uppercase text-sm">
          <tr>
            <th className="px-6 py-4">N° Solicitação</th>
            <th className="px-6 py-4">Filial</th>
            <th className="px-6 py-4">Solicitante</th>
            <th className="px-6 py-4">Serviço</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Data</th>
            <th className="px-6 py-4">Dias em aberto</th>
            <th className="px-6 py-4">Urgência</th>
            <th className="px-6 py-4">Equipamento</th>
            <th className="px-6 py-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((sol) => (
            <tr key={sol.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{sol.numSol}</td>
              <td className="px-6 py-4">{sol.filial}</td>
              <td className="px-6 py-4">{sol.userName}</td>
              <td className="px-6 py-4">{sol.categoryService}</td>
              <td className="px-6 py-4">{sol.status}</td>
              <td className="px-6 py-4">
                {new Date(sol.createdAt).toLocaleDateString("pt-BR")}
              </td>
              <td className="px-6 py-4">
                {(() => {
                  const createdDate = new Date(sol.createdAt);
                  const finalDate =
                    sol.status.toLowerCase() === "finalizado"
                      ? new Date(sol.atendedAt)
                      : new Date();

                  const diffTime = Math.abs(finalDate - createdDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return `${diffDays} dia${diffDays > 1 ? "s" : ""}`;
                })()}
              </td>
              <td className="px-6 py-4">{renderUrgencyBadge(sol.urgency)}</td>
              <td className="px-6 py-4">{sol.categoryEquipment}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => {
                    setSelectedSolicitation(sol);
                    setIsDialogOpen(true);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMobileList = () => (
    <div className="md:hidden flex flex-col gap-4 mb-8">
      {currentItems.map((sol) => (
        <div
          key={sol.id}
          className="bg-white shadow rounded-lg p-4 border border-gray-200"
        >
          <div className="font-bold text-lg mb-2">
            Solicitação #{sol.numSol}
          </div>
          <p>
            <strong>Filial:</strong> {sol.filial}
          </p>
          <p>
            <strong>Solicitante:</strong> {sol.userName}
          </p>
          <p>
            <strong>Serviço:</strong> {sol.categoryService}
          </p>
          <p>
            <strong>Status:</strong> {sol.status}
          </p>
          <p>
            <strong>Data:</strong>{" "}
            {new Date(sol.createdAt).toLocaleDateString("pt-BR")}
          </p>
          <p>
            <strong>Dias em aberto:</strong>{" "}
            {(() => {
              const createdDate = new Date(sol.createdAt);
              const finalDate =
                sol.status.toLowerCase() === "finalizado"
                  ? new Date(sol.atendedAt)
                  : new Date();

              const diffTime = Math.abs(finalDate - createdDate);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return `${diffDays} dia${diffDays > 1 ? "s" : ""}`;
            })()}
          </p>
          <div className="flex items-center gap-2">
            <strong>Urgência:</strong> {renderUrgencyBadge(sol.urgency)}
          </div>
          <p>
            <strong>Equipamento:</strong> {sol.categoryEquipment}
          </p>
          <button
            onClick={() => {
              setSelectedSolicitation(sol);
              setIsDialogOpen(true);
            }}
            className="text-blue-600 mt-2 underline"
          >
            Ver Detalhes
          </button>
        </div>
      ))}
    </div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, currentPage + 2);
        if (currentPage <= 3) end = maxVisiblePages;
        else if (currentPage >= totalPages - 2)
          start = totalPages - maxVisiblePages + 1;
        for (let i = start; i <= end; i++) pages.push(i);
      }
      return pages;
    };
    return (
      <div
        className={`flex justify-center gap-2 mb-8 ${
          !isMobile
            ? "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-md z-10"
            : ""
        }`}
      >
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        {getPageNumbers().map((n) => (
          <button
            key={n}
            onClick={() => changePage(n)}
            className={`px-4 py-2 rounded ${
              currentPage === n
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  const renderAppliedFilters = () => {
    if (!Object.keys(appliedFilters).length) return null;
    const labels = {
      startDate: "Data inicial",
      endDate: "Data final",
      status: "Status",
      requester: "Solicitante",
      filial: "Filial",
      urgency: "Urgência",
    };
    return (
      <div className="mb-4 p-3 bg-gray-100 rounded-lg">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-medium">Filtros aplicados:</span>
          {Object.entries(appliedFilters)
            .filter(([_, v]) => v)
            .map(([k, v]) => (
              <span key={k} className="bg-white px-2 py-1 rounded text-sm">
                {labels[k]}:{" "}
                {k.includes("Date")
                  ? new Date(v).toLocaleDateString("pt-BR")
                  : v}
              </span>
            ))}
          <button
            onClick={handleResetFilters}
            className="text-red-600 hover:text-red-800 text-sm font-medium ml-2"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 relative pb-20">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-lg w-full md:w-auto"
          >
            Sair
          </button>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg w-full md:w-auto"
          >
            Filtro
          </button>
          <button
            onClick={handleExportToExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg w-full md:w-auto ml-auto"
            disabled={!filteredSolicitations.length}
          >
            <FaFileExcel className="inline mr-2" /> Exportar
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">
          Follow-up de Solicitações
        </h1>
        {renderAppliedFilters()}
        {loading ? (
          <div className="text-center py-8">
            <p>Carregando solicitações...</p>
          </div>
        ) : (
          <>
            {renderDesktopTable()}
            {renderMobileList()}
          </>
        )}
        {renderPagination()}
        <SolicitationDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          solicitation={selectedSolicitation}
        />
        <FilterDialog
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
          initialFilters={appliedFilters}
        />
      </main>
      <Footer />
    </div>
  );
}

export default HubSolicitation;
