import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import DoneForm from "../components/alerts/doneForms";
import { useNavigate } from "react-router-dom";

const Solicitation = () => {
  const [loading, setLoading] = useState(false);
  const inputUrgencyRef = useRef();
  const inputCategoryEquipmentRef = useRef();
  const inputServiceRef = useRef();
  const inputDescriptionRef = useRef();
  const navigate = useNavigate();

  // Estado para o combobox de equipamentos
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState("");

  async function createSoli() {
    if (loading) return;
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token não encontrado.");
      return;
    }

    if (
      !inputUrgencyRef.current.value ||
      !inputCategoryEquipmentRef.current.value ||
      !selectedEquipment ||
      !inputServiceRef.current.value ||
      !inputDescriptionRef.current.value
    ) {
      return;
    }

    const decoded = jwtDecode(token);
    const usuario = decoded.name;
    const filial = decoded.filial;
    const costCenter = decoded.costCenter;

    const selectedEq = equipments.find(
      (equip) => equip.tagEquipment === selectedEquipment
    );

    const equipmentName = selectedEq ? selectedEq.name : "";

    let newNumSol = 1;
    try {
      const resLast = await api.get("/solicitation/last", {
        headers: { Authorization: `Bearer ${token}` },
      });
      newNumSol = resLast.data + 1;
    } catch (error) {
      console.error("Erro ao buscar último número de solicitação", error);
    }

    const data = {
      numSol: newNumSol,
      userName: usuario,
      filial: filial,
      urgency: inputUrgencyRef.current.value,
      categoryEquipment: inputCategoryEquipmentRef.current.value,
      tagEquipment: selectedEquipment,
      equipment: equipmentName,
      categoryService: inputServiceRef.current.value,
      description: inputDescriptionRef.current.value,
      status: "Aberto",
      statusDelete: false,
      costCenter: costCenter,
    };

    try {
      await api.post("/solicitation", data);
      await api.post("/solicitationHistoric", data);
    } catch (error) {
      console.error("Error creating solicitation:", error);
    }

    // Reset form
    inputUrgencyRef.current.value = "Selecione a urgência";
    inputCategoryEquipmentRef.current.value = "Selecione a categoria";
    setSelectedEquipment("");
    setEquipmentSearch("");
    inputServiceRef.current.value = "Selecione o serviço";
    inputDescriptionRef.current.value = "";

    setFormData({
      title: "",
      description: "",
      priority: "normal",
      department: "",
      attachments: null,
    });
    setSelectedCategory("");

    DoneForm();
    setLoading(false);
  }

  async function cancelSoli() {
    inputUrgencyRef.current.value = "Selecione a urgência";
    inputCategoryEquipmentRef.current.value = "Selecione a categoria";
    setSelectedEquipment("");
    setEquipmentSearch("");
    inputServiceRef.current.value = "Selecione o serviço";
    inputDescriptionRef.current.value = "";

    setFormData({
      title: "",
      description: "",
      priority: "normal",
      department: "",
      attachments: null,
    });
    setSelectedCategory("");
  }

  const [equipmentCategories, setEquipmentCategories] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

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

        const [categoriesRes, equipmentsRes] = await Promise.all([
          api.get("/categoryEquipment?deleted=false", config),
          api.get("/equipament?deleted=false", config),
        ]);

        const filteredCategories = categoriesRes.data.filter(
          (category) =>
            category.filial === userFilial && category.statusDelete === false
        );
        const filteredEquipments = equipmentsRes.data.filter(
          (equip) => equip.filial === userFilial && equip.statusDelete === false
        );

        setEquipmentCategories(filteredCategories);
        setEquipments(filteredEquipments);
      } catch (error) {
        console.error("Erro ao buscar dados:", error.response?.data || error);
      }
    };

    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "normal",
    department: "",
    attachments: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nivel");
    navigate("/");
  };

  const filteredEquipments = equipments.filter(
    (eq) => eq.categoryEquipment === selectedCategory
  );

  const sortedEquipments = [...filteredEquipments].sort((a, b) =>
    a.tagEquipment.localeCompare(b.tagEquipment, "pt-BR", {
      sensitivity: "base",
    })
  );

  const displayedEquipments = sortedEquipments.filter((eq) =>
    eq.tagEquipment.toLowerCase().includes(equipmentSearch.toLowerCase())
  );

  const handleEquipmentSelect = (tagEquipment) => {
    setSelectedEquipment(tagEquipment);
    setEquipmentSearch(tagEquipment);
    setShowEquipmentDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8 mb-16">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border-1"
        >
          <h2 className="text-2xl font-bold mb-6">Nova Solicitação</h2>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="urgency"
            >
              Urgência
            </label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              ref={inputUrgencyRef}
            >
              <option value="" disabled>
                Selecione a urgência
              </option>
              <option value="Crítico/Urgente">
                • Equipamento principal parado por quebra
              </option>
              <option value="Alta">
                • Equipamento principal operando com restrições
              </option>
              <option value="Moderada">
                • Equipamento reserva parado por quebra
              </option>
              <option value="Baixa/Agendada">
                • Equipamento reserva operando com restrições
              </option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="equipmentCategory"
            >
              Categoria de Equipamento
            </label>
            <select
              id="equipmentCategory"
              name="equipmentCategory"
              ref={inputCategoryEquipmentRef}
              value={formData.equipmentCategory || ""}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                handleChange(e);
                setSelectedEquipment("");
                setEquipmentSearch("");
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="" disabled>
                Selecione a categoria
              </option>
              {equipmentCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="equipment"
            >
              Equipamento
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar ou selecionar equipamento..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={equipmentSearch}
                onChange={(e) => {
                  setEquipmentSearch(e.target.value);
                  setShowEquipmentDropdown(true);
                }}
                onFocus={() => setShowEquipmentDropdown(true)}
                required
              />
              {selectedEquipment && (
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setSelectedEquipment("");
                    setEquipmentSearch("");
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {showEquipmentDropdown && displayedEquipments.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                {displayedEquipments.map((eq) => (
                  <li
                    key={eq.id}
                    className={`px-3 py-2 cursor-pointer hover:bg-emerald-50 ${
                      selectedEquipment === eq.tagEquipment
                        ? "bg-emerald-100"
                        : ""
                    }`}
                    onClick={() => handleEquipmentSelect(eq.tagEquipment)}
                  >
                    {eq.tagEquipment}
                  </li>
                ))}
              </ul>
            )}
            {showEquipmentDropdown && displayedEquipments.length === 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg px-3 py-2 text-gray-500">
                Nenhum equipamento encontrado
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="service"
            >
              Serviço
            </label>
            <select
              id="service"
              name="service"
              ref={inputServiceRef}
              value={formData.service || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="" disabled>
                Selecione o serviço
              </option>
              <option value="Borracheiro">Borracheiro</option>
              <option value="Mecanico">Mecânico</option>
              <option value="Eletrico">Eletrico</option>
              <option value="Lubrificação">Lubrificação</option>
              <option value="Solda">Solda</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Descrição
            </label>
            <textarea
              placeholder="Descreva o problema detalhadamente"
              id="description"
              name="description"
              ref={inputDescriptionRef}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={createSoli}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Solicitação"}
          </button>
          <button
            onClick={cancelSoli}
            type="button"
            className="w-full mt-3 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancelar Solicitação
          </button>
        </form>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleLogout}
            type="button"
            className="w-full mt-3 bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sair
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Solicitation;
