import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const UserListDialog = ({ open, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    levelUser: 1,
    filial: "",
  });
  const [filiais, setFiliais] = useState([]);

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchFiliais();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar usuários");
      setLoading(false);
      console.error(err);
    }
  };

  const fetchFiliais = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/filial", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activeFiliais = response.data.filter(
        (filial) => !filial.statusDelete
      );
      setFiliais(activeFiliais);
    } catch (err) {
      console.error("Erro ao buscar filiais:", err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      levelUser: user.levelUser,
      filial: user.filial || "",
    });
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/users/${editingUser.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingUser(null);
      fetchUsers(); // Atualiza a lista após a edição
    } catch (err) {
      console.error("Erro ao editar usuário:", err);
      alert("Erro ao editar usuário");
    }
  };

  const handleDelete = async (userId) => {
    const confirm = await Swal.fire({
      title: "Tem certeza?",
      text: "Você deseja desativar este usuário?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, desativar!",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:3000/api/users/${userId}`,
          { statusDelete: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Desativado!", "O usuário foi desativado.", "success");
        fetchUsers();
      } catch (err) {
        console.error("Erro ao desativar usuário:", err);
        Swal.fire("Erro!", "Erro ao desativar usuário.", "error");
      }
    }
  };

  // Cálculos para paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!open) return null;

  return (
    <div className="fixed inset-0  backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Lista de Usuários Cadastrados
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">Nome</th>
                    <th className="py-2 px-4 border-b">E-mail</th>
                    <th className="py-2 px-4 border-b">Nível</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{user.name}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">
                        {user.levelUser === 2
                          ? "Administrador"
                          : user.levelUser === 1
                          ? "Solicitante"
                          : "Desconhecido"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {user.statusDelete ? (
                          <span className="text-red-500">Inativo</span>
                        ) : (
                          <span className="text-green-500">Ativo</span>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Editar"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-500 hover:text-red-700"
                            title={user.statusDelete ? "Reativar" : "Desativar"}
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-4 mb-4">
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Primeira
                </button>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Anterior
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Próxima
                </button>
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Última
                </button>
              </div>
            )}
          </>
        )}

        {editingUser && (
          <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Editar Usuário</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Filial</label>
                <select
                  value={editForm.filial}
                  onChange={(e) =>
                    setEditForm({ ...editForm, filial: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Selecione</option>
                  {filiais.map((filial) => (
                    <option key={filial.id} value={filial.name}>
                      {filial.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nível</label>
                <select
                  value={editForm.levelUser}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      levelUser: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value={1}>Solicitante</option>
                  <option value={2}>Administrador</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListDialog;
