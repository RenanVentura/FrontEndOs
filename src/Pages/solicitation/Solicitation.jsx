import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/footer";

const Solicitation = () => {
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
            >
              <option value="" disabled>
                Selecione a urgência
              </option>
              <option value="1. Equipamento principal parado por quebra">
                1. Equipamento principal parado por quebra
              </option>
              <option value="2. Equipamento principal operando com restrições">
                2. Equipamento principal operando com restrições
              </option>
              <option value="3. Equipamento reserva parado por quebra">
                3. Equipamento reserva parado por quebra
              </option>
              <option value="4. Equipamento principal operando com restrições">
                4. Equipamento reserva operando com restrições
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
              value={formData.equipmentCategory || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="" disabled>
                Selecione a categoria
              </option>
              <option value="computers">Computadores</option>
              <option value="printers">Impressoras</option>
              <option value="network">Rede</option>
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
              value={formData.equipment || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="" disabled>
                Selecione o equipamento
              </option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="router">Roteador</option>
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
              value={formData.service || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="" disabled>
                Selecione o serviço
              </option>
              <option value="maintenance">Manutenção</option>
              <option value="installation">Instalação</option>
              <option value="repair">Reparo</option>
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
              id="description"
              name="description"
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
      </main>

      <Footer />
    </div>
  );
};

export default Solicitation;
