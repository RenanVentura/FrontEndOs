import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const FilialListDialog = ({ open, onClose }) => {
  const [filiais, setFiliais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingFilial, setEditingFilial] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
  });

  useEffect(() => {
    if (open) {
      fetchFiliais();
    }
  }, [open]);

  const fetchFiliais = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        // "http://localhost:3000/api/filial",
        "https://backendos.onrender.com/api/filial",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFiliais(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar filiais");
      setLoading(false);
      console.error(err);
    }
  };

  const handleEdit = (filial) => {
    setEditingFilial(filial);
    setEditForm({
      name: filial.name,
    });
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/filial/${editingFilial.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingFilial(null);
      fetchFiliais(); // Atualiza a lista após a edição
      Swal.fire("Sucesso!", "Filial atualizada com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao editar filial:", err);
      Swal.fire("Erro!", "Erro ao editar filial.", "error");
    }
  };

  const handleDelete = async (filialId) => {
    const confirm = await Swal.fire({
      title: "Tem certeza?",
      text: "Você deseja desativar esta filial?",
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
          `http://localhost:3000/api/filial/${filialId}`,
          { statusDelete: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Desativada!", "A filial foi desativada.", "success");
        fetchFiliais();
      } catch (err) {
        console.error("Erro ao desativar filial:", err);
        Swal.fire("Erro!", "Erro ao desativar filial.", "error");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lista de Filiais</h2>
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
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filiais.map((filial) => (
                  <tr key={filial.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{filial.name}</td>
                    <td className="py-2 px-4 border-b">
                      {filial.statusDelete ? (
                        <span className="text-red-500">Inativa</span>
                      ) : (
                        <span className="text-green-500">Ativa</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(filial)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Editar"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(filial.id)}
                          className="text-red-500 hover:text-red-700"
                          title={filial.statusDelete ? "Reativar" : "Desativar"}
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

        {editingFilial && (
          <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Editar Filial</h3>
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
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingFilial(null)}
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

export default FilialListDialog;
