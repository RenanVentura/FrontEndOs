import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import { FaList } from "react-icons/fa";
import EquipmentListDialog from "../list/EquipmentList";

const RegisterEquipmentDialog = ({ open, onClose, onSubmit }) => {
  const [showList, setShowList] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tagEquipment: "",
    filial: "",
    categoryEquipment: "",
    statusDelete: false,
  });

  const [filiais, setFiliais] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userFilial = decoded.filial;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch filiais
        const filiaisResponse = await api.get("/filial", config);
        const filteredFiliais = filiaisResponse.data.filter(
          (filial) => filial.statusDelete === false
        );
        setFiliais(filteredFiliais);

        // Fetch categories
        const categoriesResponse = await api.get("/categoryEquipment", config);
        const filteredCategories = categoriesResponse.data.filter(
          (category) => !category.statusDelete
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Erro ao buscar dados:", error.response?.data || error);
      }
    };

    fetchData();
  }, []);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      // Verifica se todos os campos obrigatórios estão preenchidos
      if (
        !formData.name ||
        !formData.tagEquipment ||
        !formData.filial ||
        !formData.categoryEquipment
      ) {
        throw new Error("Todos os campos obrigatórios devem ser preenchidos");
      }

      // Preparar os dados para envio
      const equipmentData = {
        ...formData,
        statusDelete: false,
      };

      const response = await api.post("/Equipament", equipmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 segundos de timeout
      });

      if (response.status === 201 || response.status === 200) {
        console.log("Equipamento criado:", response.data);
        setSuccess(true);
        setFormData({
          name: "",
          tagEquipment: "",
          filial: "",
          categoryEquipment: "",
          statusDelete: false,
        });

        setTimeout(() => {
          setSuccess(false);
          onClose();
          if (onSubmit) onSubmit(response.data);
        }, 1500);
      }
    } catch (err) {
      console.error("Erro detalhado:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Erro ao cadastrar equipamento. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 backdrop-blur-md flex justify-center items-center z-50 ${
          !open && "hidden"
        }`}
      >
        <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">CADASTRO DE EQUIPAMENTOS</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowList(true)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                title="Ver lista de equipamentos"
              >
                <FaList size={18} />
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-md text-sm text-center">
              {error}
            </div>
          )}{" "}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 p-4 mb-4 rounded-md text-sm font-medium text-center">
              Equipamento cadastrado com sucesso!
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nome*
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

            {/* Tag do Equipamento */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tag do Equipamento*
              </label>
              <input
                type="text"
                name="tagEquipment"
                value={formData.tagEquipment}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Categoria (dinâmica) */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Categoria*
              </label>
              <select
                name="categoryEquipment"
                value={formData.categoryEquipment}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecione</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filial (dinâmica) */}
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

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <EquipmentListDialog open={showList} onClose={() => setShowList(false)} />
    </>
  );
};

export default RegisterEquipmentDialog;
