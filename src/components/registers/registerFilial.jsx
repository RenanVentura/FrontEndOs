import React, { useState } from "react";
import api from "../../services/api";
import { FaList } from "react-icons/fa";
import FilialListDialog from "../list/FilialList";

const RegisterFilialDialog = ({ open, onClose, onSubmit }) => {
  const [showList, setShowList] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    statusDelete: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      const response = await api.post("/filial", formData);
      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          name: "",
          statusDelete: false,
        });
        if (onSubmit) onSubmit(response.data);
      }
    } catch (err) {
      console.error("Erro detalhado:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Erro ao cadastrar filial. Tente novamente."
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
            <h2 className="text-xl font-semibold">CADASTRO DE FILIAIS</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowList(true)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                title="Ver lista de filiais"
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
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-2 mb-4 rounded-md text-sm text-center">
              Filial cadastrada com sucesso!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nome da Filial*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Digite o nome da filial"
              />
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

      <FilialListDialog open={showList} onClose={() => setShowList(false)} />
    </>
  );
};

export default RegisterFilialDialog;
