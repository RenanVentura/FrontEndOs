import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const EquipmentListDialog = ({ open, onClose }) => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editForm, setEditForm] = useState({
    name: "",
  });

  useEffect(() => {
    if (open) {
      fetchEquipments();
    }
  }, [open, currentPage]);

  const fetchEquipments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        // "http://localhost:3000/api/Equipament",
        "https://backendos.onrender.com/api/Equipament",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEquipments(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar equipamentos");
      setLoading(false);
      console.error(err);
    }
  };

  const handleEdit = (equipment) => {
    setEditingEquipment(equipment);
    setEditForm({
      name: equipment.name,
    });
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        // `http://localhost:3000/api/Equipament/${editingEquipment.id}`,
        `https://backendos.onrender.com/api/Equipament/${editingEquipment.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingEquipment(null);
      fetchEquipments();
      Swal.fire("Sucesso!", "Equipamento atualizado com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao editar equipamento:", err);
      Swal.fire("Erro!", "Erro ao editar equipamento.", "error");
    }
  };

  const handleDelete = async (equipmentId) => {
    const confirm = await Swal.fire({
      title: "Tem certeza?",
      text: "Você deseja desativar este equipamento?",
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
          // `http://localhost:3000/api/Equipament/${equipmentId}`,
          `https://backendos.onrender.com/api/Equipament/${equipmentId}`,
          { statusDelete: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Desativado!", "O equipamento foi desativado.", "success");
        fetchEquipments();
      } catch (err) {
        console.error("Erro ao desativar equipamento:", err);
        Swal.fire("Erro!", "Erro ao desativar equipamento.", "error");
      }
    }
  };

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = equipments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(equipments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lista de Equipamentos</h2>
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
                    <th className="py-2 px-4 border-b">Tag</th>
                    <th className="py-2 px-4 border-b">Categoria</th>
                    <th className="py-2 px-4 border-b">Filial</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((equipment) => (
                    <tr key={equipment.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{equipment.name}</td>
                      <td className="py-2 px-4 border-b">
                        {equipment.tagEquipment}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {equipment.categoryEquipment}
                      </td>
                      <td className="py-2 px-4 border-b">{equipment.filial}</td>
                      <td className="py-2 px-4 border-b">
                        {equipment.statusDelete ? (
                          <span className="text-red-500">Inativo</span>
                        ) : (
                          <span className="text-green-500">Ativo</span>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(equipment)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Editar"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(equipment.id)}
                            className="text-red-500 hover:text-red-700"
                            title={
                              equipment.statusDelete ? "Reativar" : "Desativar"
                            }
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

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}

        {editingEquipment && (
          <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Editar Equipamento</h3>
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
                  onClick={() => setEditingEquipment(null)}
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

export default EquipmentListDialog;
