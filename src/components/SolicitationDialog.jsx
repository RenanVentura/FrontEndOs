import React from "react";
import { IoClose } from "react-icons/io5";
import { GoPencil, GoTrash } from "react-icons/go";
import api from "../services/api";
import doneForms from "../components/alerts/doneForms";

function SolicitationDialog({ isOpen, onClose, solicitation }) {
  if (!isOpen) return null;

  async function handleFinish() {
    const { _id, id, ...cleanSolicitation } = solicitation;
    try {
      await api.put(`/solicitation/${solicitation.id}`, {
        status: "Finalizado",
        atendedAt: new Date(),
      });
      await api.post("solicitationHistoric", {
        ...cleanSolicitation,
        status: "Finalizado",
        atendedAt: new Date(),
      });
      onClose();
      doneForms();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating solicitation:", error);
    }
  }
  const InfoItem = ({ label, value }) => (
    <div>
      <span className="font-medium text-gray-700">{label}:</span>{" "}
      <span className="text-gray-600">{value}</span>
    </div>
  );

  const UrgencyBadge = ({ urgency }) => {
    const urgencyColors = {
      "Crítico/Urgente": "bg-red-600 text-white",
      Alta: "bg-orange-500 text-white",
      Moderada: "bg-yellow-400 text-black",
      Baixa: "bg-green-500 text-white",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          urgencyColors[urgency] || "bg-gray-500 text-white"
        }`}
      >
        {urgency}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-xl p-8 w-full max-w-3xl shadow-2xl relative transform transition-all">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Solicitação #{solicitation.numSol}
          </h2>
          <div className="flex items-center gap-4">
            <button className="text-gray-400  transition-colors">
              <p className="text-2xl font-bold text-gray-500 hover:text-gray-600">
                <GoPencil />
              </p>
            </button>
            <button className="text-gray-400 hover:text-red-600 transition-colors">
              <p className="text-2xl font-bold text-gray-500 hover:text-gray-600">
                <GoTrash />
              </p>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 transition-colors"
            >
              <p className="text-2xl font-bold text-gray-500 hover:text-gray-600">
                <IoClose />
              </p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <InfoItem label="Filial" value={solicitation.filial} />
            <InfoItem label="Solicitante" value={solicitation.userName} />
            <InfoItem label="Centro de Custo" value={solicitation.costCenter} />
            <InfoItem label="Serviço" value={solicitation.categoryService} />
            <InfoItem label="Status" value={solicitation.status} />
            <InfoItem
              label="Data de Criação"
              value={
                solicitation.createdAt
                  ? new Date(solicitation.createdAt).toLocaleDateString()
                  : "-"
              }
            />
          </div>

          <div className="space-y-4">
            <InfoItem
              label="Data Atendida"
              value={
                solicitation.atendedAt
                  ? new Date(solicitation.atendedAt).toLocaleDateString()
                  : "-"
              }
            />
            <InfoItem
              label="Data Prevista"
              value={
                solicitation.PrevAtendedAt
                  ? new Date(solicitation.PrevAtendedAt).toLocaleDateString()
                  : "-"
              }
            />
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Urgência:</span>
              <UrgencyBadge urgency={solicitation.urgency} />
            </div>
            <InfoItem
              label="Categoria de Equipamento"
              value={solicitation.categoryEquipment}
            />
            <InfoItem
              label="Tag Equipamento"
              value={solicitation.tagEquipment}
            />
            <InfoItem label="Equipamento" value={solicitation.equipment} />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-2">Descrição</h3>
          <p className="text-gray-600 whitespace-pre-wrap">
            {solicitation.description}
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleFinish}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SolicitationDialog;
