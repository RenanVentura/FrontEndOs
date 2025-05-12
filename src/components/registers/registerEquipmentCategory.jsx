import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import { FaEdit, FaTrash, FaList } from "react-icons/fa";

const RegisterEquipmentCategoryDialog = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    filial: "",
    statusDelete: false,
  });

  const [filiais, setFiliais] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [editingCategory, setEditingCategory] = useState(null);

  // Fetch filiais
  useEffect(() => {
    const fetchFiliais = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get("/filial", config);
        const filtered = response.data.filter(
          (filial) => filial.statusDelete === false
        );
        setFiliais(filtered);
      } catch (error) {
        console.error("Erro ao buscar filiais:", error);
      }
    };

    fetchFiliais();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get("/categoryEquipment", config);
        const filtered = response.data.filter(
          (category) => category.statusDelete === false
        );
        setCategories(filtered);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, [success]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response;
      if (editingCategory) {
        response = await api.put(
          `/categoryEquipment/${editingCategory.id}`,
          formData,
          config
        );
      } else {
        response = await api.post("/categoryEquipment", formData, config);
      }

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        setFormData({
          name: "",
          filial: "",
          statusDelete: false,
        });
        setEditingCategory(null);

        // Atualiza a lista de categorias
        const categoriesResponse = await api.get("/categoryEquipment", config);
        const filtered = categoriesResponse.data.filter(
          (category) => category.statusDelete === false
        );
        setCategories(filtered);

        setTimeout(() => {
          setSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Erro detalhado:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Erro ao cadastrar categoria. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      filial: category.filial,
      statusDelete: category.statusDelete,
    });
  };

  const handleDelete = async (category) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await api.put(
        `/categoryEquipment/${category.id}`,
        { ...category, statusDelete: true },
        config
      );

      // Atualiza a lista de categorias
      const response = await api.get("/categoryEquipment", config);
      const filtered = response.data.filter(
        (category) => category.statusDelete === false
      );
      setCategories(filtered);
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      setError("Erro ao deletar categoria. Tente novamente.");
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            CADASTRO DE CATEGORIA DE EQUIPAMENTOS
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-2 mb-4 rounded-md text-sm text-center">
            {editingCategory
              ? "Categoria atualizada com sucesso!"
              : "Categoria cadastrada com sucesso!"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nome da Categoria*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Filial */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Filial*
              </label>
              <select
                name="filial"
                value={formData.filial}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecione</option>
                {filiais.map((filial) => (
                  <option key={filial.id} value={filial.name}>
                    {filial.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3">
            {editingCategory && (
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setFormData({
                    name: "",
                    filial: "",
                    statusDelete: false,
                  });
                }}
                className="px-4 py-2 border rounded-lg text-gray-700"
              >
                Cancelar Edição
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Salvando..."
                : editingCategory
                ? "Atualizar"
                : "Cadastrar"}
            </button>
          </div>
        </form>

        {/* Lista de Categorias */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Categorias Cadastradas</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.filial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterEquipmentCategoryDialog;
