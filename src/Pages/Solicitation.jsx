import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import DoneForm from "../components/alerts/doneForms";

const Solicitation = () => {
  const inputUrgencyRef = useRef();
  const inputCategoryEquipmentRef = useRef();
  const inputEquipmentRef = useRef();
  const inputServiceRef = useRef();
  const inputDescriptionRef = useRef();

  async function createSoli() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token não encontrado.");
      return;
    }

    if (
      !inputUrgencyRef.current.value ||
      !inputCategoryEquipmentRef.current.value ||
      !inputEquipmentRef.current.value ||
      !inputServiceRef.current.value ||
      !inputDescriptionRef.current.value
    ) {
      return;
    }

    const decoded = jwtDecode(token);
    const usuario = decoded.name;
    const filial = decoded.filial;
    const costCenter = decoded.costCenter;

    const selectedTag = inputEquipmentRef.current.value;

    const selectedEquipment = equipments.find(
      (equip) => equip.tagEquipment === selectedTag
    );

    const equipmentName = selectedEquipment ? selectedEquipment.name : "";

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
      tagEquipment: inputEquipmentRef.current.value,
      equipment: equipmentName,
      categoryService: inputServiceRef.current.value,
      description: inputDescriptionRef.current.value,
      status: "Pendente",
      statusDelete: false,
      costCenter: costCenter,
    };

    try {
      const response = await api.post("/solicitation", data);
      console.log(response.data);
    } catch (error) {
      console.error("Error creating solicitation:", error);
    }

    try {
      const response = await api.post("/solicitationHistoric", data);
      console.log(response.data);
    } catch (error) {
      console.error("Error creating solicitation:", error);
    }

    inputUrgencyRef.current.value = "Selecione a urgência";
    inputCategoryEquipmentRef.current.value = "Selecione a categoria";
    inputEquipmentRef.current.value = "Selecione o equipamento";
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
          api.get("/categoryEquipment", config),
          api.get("/Equipament", config),
        ]);

        // Filtrar por filial
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
    window.location.href = "/";
  };

  const filteredEquipments = equipments.filter(
    (eq) => eq.categoryEquipment === selectedCategory
  );

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
              <option value="Critico/Urgente">
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
                setSelectedCategory(e.target.value); // Atualiza o filtro
                handleChange(e); // Atualiza formData se necessário
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

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="equipment"
            >
              Equipamento
            </label>
            <select
              id="equipment"
              name="equipment"
              ref={inputEquipmentRef}
              value={formData.equipment || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="" disabled>
                Selecione o equipamento
              </option>
              {filteredEquipments.map((eq) => (
                <option key={eq.id} value={eq.tagEquipment}>
                  {eq.tagEquipment}
                </option>
              ))}
            </select>
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
            className="w-full bg-emerald-600 text-white gon py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
            onClick={createSoli}
          >
            Enviar Solicitação
          </button>
          <button
            type="submit"
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
