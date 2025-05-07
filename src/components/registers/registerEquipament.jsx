import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { MdEdit, MdDelete, MdCheck, MdClose } from "react-icons/md";

const RegisterEquipmentDialog = ({ open, onClose, onEquipmentCreated }) => {
  const [name, setName] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState({
    form: false,
    list: false,
    status: null,
  });
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentEquipmentId, setCurrentEquipmentId] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    if (open) {
      fetchEquipments();
    }
  }, [open, showInactive]);

  const fetchEquipments = async () => {
    try {
      setLoading((prev) => ({ ...prev, list: true }));
      const response = await api.get(`/equipment?deleted=${showInactive}`);
      setEquipments(response.data);
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
      setError(error.response?.data?.error || "Erro ao carregar equipamentos");
    } finally {
      setLoading((prev) => ({ ...prev, list: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("O nome do equipamento é obrigatório");
      return;
    }

    setLoading((prev) => ({ ...prev, form: true }));
    setError("");

    try {
      if (editMode) {
        await api.put(`/equipment/${currentEquipmentId}`, { name });
      } else {
        await api.post("/equipment", { name });
      }
      fetchEquipments();
      resetForm();
      onEquipmentCreated?.();
    } catch (error) {
      console.error("Erro ao salvar equipamento:", error);
      setError(error.response?.data?.error || "Erro ao processar requisição");
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  const handleEdit = (equipment) => {
    setName(equipment.name);
    setCurrentEquipmentId(equipment.id);
    setEditMode(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      setLoading((prev) => ({ ...prev, status: id }));
      await api.patch(`/equipment/${id}/toggleStatus`);
      fetchEquipments();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      setError(
        error.response?.data?.error || "Erro ao alterar status do equipamento"
      );
    } finally {
      setLoading((prev) => ({ ...prev, status: null }));
    }
  };

  const resetForm = () => {
    setName("");
    setCurrentEquipmentId(null);
    setEditMode(false);
    setError("");
  };

  const filteredEquipments = showInactive
    ? equipments
    : equipments.filter((equipment) => !equipment.statusDelete);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        resetForm();
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: green[500], color: "white" }}>
        {editMode ? "Editar Equipamento" : "Cadastrar Novo Equipamento"}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Nome do Equipamento"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading.form}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            {editMode && (
              <Button
                onClick={resetForm}
                sx={{ mr: 1 }}
                disabled={loading.form}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading.form}
            >
              {loading.form ? (
                <CircularProgress size={24} />
              ) : editMode ? (
                "Salvar"
              ) : (
                "Cadastrar"
              )}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Equipamentos Cadastrados</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showInactive}
                  onChange={() => setShowInactive(!showInactive)}
                  disabled={loading.list}
                />
              }
              label="Mostrar inativos"
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: green[100] }}>
                  <TableCell>Nome</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading.list ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredEquipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Nenhum equipamento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEquipments.map((equipment) => (
                    <TableRow key={equipment.id}>
                      <TableCell>{equipment.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={equipment.statusDelete ? "Inativo" : "Ativo"}
                          color={equipment.statusDelete ? "error" : "success"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(equipment)}
                          disabled={
                            equipment.statusDelete ||
                            loading.status === equipment.id
                          }
                        >
                          <MdEdit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleToggleStatus(equipment.id)}
                          disabled={loading.status === equipment.id}
                        >
                          {loading.status === equipment.id ? (
                            <CircularProgress size={24} />
                          ) : equipment.statusDelete ? (
                            <MdCheck color="success" />
                          ) : (
                            <MdDelete color="error" />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            resetForm();
          }}
          disabled={loading.form || loading.list}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterEquipmentDialog;
