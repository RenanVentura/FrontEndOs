import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";

const UserListDialog = ({ open, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      fetchUsers();
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

  const handleEdit = (userId) => {
    // Implementar lógica de edição
    console.log("Editar usuário:", userId);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Tem certeza que deseja desativar este usuário?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:3000/api/users/${userId}/status`,
          { statusDelete: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchUsers(); // Atualiza a lista após a exclusão
      } catch (err) {
        console.error("Erro ao desativar usuário:", err);
        alert("Erro ao desativar usuário");
      }
    }
  };

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
                {users.map((user) => (
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
                          onClick={() => handleEdit(user.id)}
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
        )}
      </div>
    </div>
  );
};

export default UserListDialog;
