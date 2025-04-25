import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const FilterDialog = ({ isOpen, onClose, onApplyFilters }) => {
  // Estados para dados e carregamento
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLevel, setUserLevel] = useState(null);

  // Estado dos filtros
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    requesterId: "",
    requesterName: "",
    branchId: "",
    branchName: "",
    urgency: "",
  });

  // Carrega usuários e filiais quando o diálogo abre
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        setError(null);

        const decoded = jwtDecode(token);
        setUserLevel(decoded.nivel);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [usersResponse, branchesResponse] = await Promise.all([
          api.get("/users", config),
          api.get("/filial", config),
        ]);

        setUsers(usersResponse.data);
        setBranches(decoded.nivel === 1 ? [] : branchesResponse.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar opções de filtro");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) loadData();
  }, [isOpen]);

  // Manipula mudanças nos filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Tratamento especial para solicitante e filial
    if (name === "requesterId") {
      const selectedUser = users.find((user) => user.id === value);
      setFilters((prev) => ({
        ...prev,
        requesterId: value,
        requesterName: selectedUser?.name || "",
      }));
    } else if (name === "branchId") {
      const selectedBranch = branches.find((branch) => branch.id === value);
      setFilters((prev) => ({
        ...prev,
        branchId: value,
        branchName: selectedBranch?.nome || selectedBranch?.name || "",
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Aplica os filtros
  const handleApplyFilters = (e) => {
    e.preventDefault();

    // Prepara os filtros para envio
    const filtersToSend = {
      startDate: filters.startDate ? `${filters.startDate}T00:00:00` : null,
      endDate: filters.endDate ? `${filters.endDate}T23:59:59` : null,
      status: filters.status || null,
      requester: filters.requesterName || null, // Envia o nome do solicitante
      filial: filters.branchName || null, // Envia o nome da filial
      urgency: filters.urgency || null,
    };

    // Remove campos vazios/nulos
    const cleanedFilters = Object.fromEntries(
      Object.entries(filtersToSend).filter(([_, v]) => v !== null && v !== "")
    );

    console.log("Filtros aplicados:", cleanedFilters);
    onApplyFilters(cleanedFilters);
    onClose();
  };

  // Reseta todos os filtros
  const handleResetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      status: "",
      requesterId: "",
      requesterName: "",
      branchId: "",
      branchName: "",
      urgency: "",
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Filtros
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleApplyFilters} className="space-y-4">
            {/* Filtros de Data */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Inicial
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Final
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Filtro de Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
              >
                <option value="">Todos os status</option>
                <option value="Aberto">Aberto</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            {/* Filtro de Solicitante (apenas para níveis diferentes de 1) */}
            {userLevel !== 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Solicitante
                </label>
                <select
                  name="requesterId"
                  value={filters.requesterId}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                  disabled={loading}
                >
                  <option value="">Todos os solicitantes</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || `Usuário ${user.id}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro de Filial (apenas para níveis diferentes de 1) */}
            {userLevel !== 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filial
                </label>
                <select
                  name="branchId"
                  value={filters.branchId}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                  disabled={loading || branches.length === 0}
                >
                  <option value="">Todas as filiais</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.nome || branch.name || `Filial ${branch.id}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro de Urgência */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgência
              </label>
              <select
                name="urgency"
                value={filters.urgency}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
              >
                <option value="">Todas as urgências</option>
                <option value="Baixa/Agendada">Baixa/Agendada</option>
                <option value="Moderada">Moderada</option>
                <option value="Alta">Alta</option>
                <option value="Crítico/Urgente">Crítico/Urgente</option>
              </select>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Limpar Filtros
              </button>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Aplicando..." : "Aplicar Filtros"}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FilterDialog;
