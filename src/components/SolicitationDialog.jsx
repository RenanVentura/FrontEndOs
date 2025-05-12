import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { GoPencil, GoTrash } from "react-icons/go";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import doneForms from "../components/alerts/doneForms";
import ConfirmButton from "../components/alerts/ConfirmButtom";
import Swal from "sweetalert2";

function SolicitationDialog({ isOpen, onClose, solicitation }) {
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("token");
  const userLevel = token ? jwtDecode(token).nivel : null;

  const [editedValues, setEditedValues] = useState({
    status: solicitation?.status || "",
    atendedAt: solicitation?.atendedAt || "",
    PrevAtendedAt: solicitation?.PrevAtendedAt || "",
    urgency: solicitation?.urgency || "",
  });

  if (!isOpen) return null;

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditedValues((prev) => ({ ...prev, [name]: value }));
  }

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
      console.error("Erro ao finalizar:", error);
    }
  }

  async function handleRemove() {
    const confirmed = await ConfirmButton();
    if (!confirmed) return;

    const { _id, id, ...cleanSolicitation } = solicitation;
    try {
      await api.put(`/solicitation/${solicitation.id}`, {
        statusDelete: true,
      });

      await api.post("solicitationHistoric", {
        ...cleanSolicitation,
        statusDelete: true,
      });

      await Swal.fire({
        title: "Deletado!",
        text: "A solicitação foi deletada com sucesso!",
        icon: "success",
      });

      window.location.reload();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      Swal.fire("Erro!", "Houve um problema ao deletar.", "error");
    }
  }

  async function handleUpdate() {
    const { _id, id, ...cleanSolicitation } = solicitation;

    try {
      await api.put(`/solicitation/${solicitation.id}`, editedValues);

      await api.post("solicitationHistoric", {
        ...cleanSolicitation,
        ...editedValues,
      });

      setIsEditing(false);
      Swal.fire("Sucesso!", "Solicitação atualizada!", "success");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      Swal.fire("Erro!", "Houve um problema ao atualizar.", "error");
    }
  }

  const InfoItem = ({ label, value }) => (
    <div>
      <span className="font-medium text-gray-700">{label}:</span>{" "}
      <span className="text-gray-600">{value}</span>
    </div>
  );

  const EditableItem = ({ label, name, type, options }) => (
    <div>
      <label className="font-medium text-gray-700 block">{label}:</label>
      {type === "select" ? (
        <select
          name={name}
          value={editedValues[name]}
          onChange={handleEditChange}
          className="border border-emerald-400 rounded-md px-2 py-1 text-sm w-full"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="date"
          name={name}
          value={editedValues[name]?.slice(0, 10) || ""}
          onChange={handleEditChange}
          className="border border-emerald-400 rounded-md px-2 py-1 text-sm w-full"
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-xl p-8 w-full max-w-3xl shadow-2xl relative z-10">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Solicitação #{solicitation.numSol}
          </h2>
          <div className="flex items-center gap-4">
            {userLevel !== 1 && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  <GoPencil size={22} />
                </button>
                <button
                  onClick={handleRemove}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <GoTrash size={22} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <InfoItem label="Filial" value={solicitation.filial} />
          <InfoItem label="Solicitante" value={solicitation.userName} />
          <InfoItem label="Centro de Custo" value={solicitation.costCenter} />
          <InfoItem label="Serviço" value={solicitation.categoryService} />

          {isEditing ? (
            <>
              <EditableItem
                label="Status"
                name="status"
                type="select"
                options={["Pendente", "Fechado"]}
              />
              <EditableItem
                label="Data Atendida"
                name="atendedAt"
                type="date"
              />
              <EditableItem
                label="Data Prevista"
                name="PrevAtendedAt"
                type="date"
              />
              <EditableItem
                label="Urgência"
                name="urgency"
                type="select"
                options={["Baixa", "Moderada", "Alta", "Crítico/Urgente"]}
              />
            </>
          ) : (
            <>
              <InfoItem label="Status" value={solicitation.status} />
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
              <InfoItem label="Urgência" value={solicitation.urgency} />
            </>
          )}

          <InfoItem
            label="Categoria de Equipamento"
            value={solicitation.categoryEquipment}
          />
          <InfoItem label="Tag Equipamento" value={solicitation.tagEquipment} />
          <InfoItem label="Equipamento" value={solicitation.equipment} />
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-2">Descrição</h3>
          <p className="text-gray-600 whitespace-pre-wrap">
            {solicitation.description}
          </p>
        </div>

        {isEditing ? (
          userLevel !== 1 && (
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-400 transition-colors "
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          )
        ) : (
          <div className="mt-6 flex justify-end">
            {userLevel !== 1 && (
              <button
                onClick={handleFinish}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Finalizar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SolicitationDialog;
