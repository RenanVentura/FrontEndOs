import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import { FaList } from "react-icons/fa";
import UserListDialog from "../list/UserList";

const RegisterUserDialog = ({ open, onClose, onSubmit }) => {
  const [showList, setShowList] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    levelUser: "",
    filial: "",
    costCenter: "",
    statusDelete: false,
  });

  const [filiais, setFiliais] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchFiliais = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userFilial = decoded.filial;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get("/filial", config);

        // Supondo que você queira mostrar só a filial do usuário (se for o caso)
        const filtered = response.data.filter(
          (filial) => filial.statusDelete === false
        );
        setFiliais(filtered);
      } catch (error) {
        console.error("Erro ao buscar filiais:", error.response?.data || error);
      }
    };

    fetchFiliais();
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

    try {
      const payload = {
        ...formData,
        levelUser: parseInt(formData.levelUser),
      };

      const response = await api.post("/users", payload);

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          levelUser: "",
          filial: "",
          costCenter: "",
          statusDelete: false,
        });

        setTimeout(() => {
          onClose();
          if (onSubmit) onSubmit(response.data);
        }, 1500);
      }
    } catch (err) {
      console.error("Erro detalhado:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Erro ao cadastrar usuário. Tente novamente."
      );
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0  backdrop-blur-md flex justify-center items-center z-50 ${
          !open && "hidden"
        }`}
      >
        <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">CADASTRO DE USUÁRIOS</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowList(true)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                title="Ver lista de usuários"
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
              Usuário cadastrado com sucesso!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nome Completo*
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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Senha* (mínimo 6 caracteres)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Nível de Acesso */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nível de Acesso*
              </label>
              <select
                name="levelUser"
                value={formData.levelUser}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecione</option>
                <option value="2">Administrador</option>
                <option value="1">Usuário</option>
              </select>
            </div>

            {/* Filial (dinâmica) */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Filial
              </label>
              <select
                name="filial"
                value={formData.filial}
                onChange={handleChange}
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

            {/* Centro de Custo */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Centro de Custo
              </label>
              <select
                name="costCenter"
                value={formData.costCenter}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecione</option>
                <option value="FROTAS">FROTAS</option>
                <option value="AGRICOLA">AGRICOLA</option>
                <option value="TI">TI</option>
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

      <UserListDialog
        open={showList}
        onClose={() => setShowList(false)}
        onEdit={(userData) => {
          // Preenche o formulário com os dados do usuário para edição
          setShowList(false);
          // Implemente a lógica para preencher os campos do formulário
        }}
      />
    </>
  );
};

export default RegisterUserDialog;
