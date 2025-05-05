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

const RegisterFilialDialog = ({ open, onClose, onFilialCreated }) => {
  const [name, setName] = useState("");
  const [filiais, setFiliais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentFilialId, setCurrentFilialId] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    if (open) {
      fetchFiliais();
    }
  }, [open, showInactive]);

  const fetchFiliais = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/filial?status=${showInactive ? "inactive" : "active"}`
      );
      setFiliais(response.data);
    } catch (error) {
      console.error("Erro ao buscar filiais:", error);
      setError("Erro ao carregar filiais");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("O nome da filial é obrigatório");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (editMode) {
        await api.put(`/filial/${currentFilialId}`, { name });
      } else {
        await api.post("/filial", { name });
      }
      fetchFiliais();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar filial:", error);
      setError(error.response?.data?.error || "Erro ao processar requisição");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (filial) => {
    setName(filial.name);
    setCurrentFilialId(filial.id);
    setEditMode(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      setLoading(true);
      await api.patch(`/filial/${id}/toggleStatus`);
      fetchFiliais();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      setError("Erro ao alterar status da filial");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setCurrentFilialId(null);
    setEditMode(false);
  };

  const filteredFiliais = showInactive
    ? filiais
    : filiais.filter((filial) => !filial.statusDelete);

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
        {editMode ? "Editar Filial" : "Cadastrar Nova Filial"}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Nome da Filial"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            {editMode && (
              <Button onClick={resetForm} sx={{ mr: 1 }}>
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
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
            <Typography variant="h6">Filiais Cadastradas</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showInactive}
                  onChange={() => setShowInactive(!showInactive)}
                />
              }
              label="Mostrar inativas"
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
                {filteredFiliais.map((filial) => (
                  <TableRow key={filial.id}>
                    <TableCell>{filial.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={filial.statusDelete ? "Inativa" : "Ativa"}
                        color={filial.statusDelete ? "error" : "success"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(filial)}
                        disabled={filial.statusDelete}
                      >
                        <MdEdit />
                      </IconButton>
                      <IconButton onClick={() => handleToggleStatus(filial.id)}>
                        {filial.statusDelete ? (
                          <MdCheck color="success" />
                        ) : (
                          <MdDelete color="error" />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterFilialDialog;
