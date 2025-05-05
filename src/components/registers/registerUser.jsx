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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { MdEdit, MdDelete, MdCheck, MdClose } from "react-icons/md";

const greenTheme = {
  primary: "#2e7d32",
  light: "#81c784",
  dark: "#1b5e20",
  contrastText: "#ffffff",
};

const RegisterUserDialog = ({ open, onClose, onUserCreated }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [userInfo, setUserInfo] = useState({
    email: "",
    name: "",
    password: "",
    filial: "",
    levelUser: "1",
    costCenter: "",
  });
  const [users, setUsers] = useState([]);
  const [filiais, setFiliais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingFiliais, setLoadingFiliais] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (open) {
      fetchFiliais();
      if (activeTab === 1) fetchUsers();
    }
  }, [open, activeTab]);

  const fetchFiliais = async () => {
    setLoadingFiliais(true);
    setError("");
    try {
      const response = await api.get("/filial");
      setFiliais(response.data);
    } catch (error) {
      console.error("Erro ao buscar filiais:", error);
      setError("Não foi possível carregar a lista de filiais");
    } finally {
      setLoadingFiliais(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError("");
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setError("Não foi possível carregar a lista de usuários");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editMode) {
        await api.put(`/users/${currentUserId}`, {
          ...userInfo,
          levelUser: parseInt(userInfo.levelUser),
        });
      } else {
        await api.post("/users", {
          ...userInfo,
          levelUser: parseInt(userInfo.levelUser),
        });
      }
      onUserCreated();
      fetchUsers();
      resetForm();
      setActiveTab(1); // Muda para a aba de listagem após cadastro
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      setError(error.response?.data?.message || "Erro ao salvar usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setUserInfo({
      email: user.email,
      name: user.name,
      password: "",
      filial: user.filial.id,
      levelUser: user.levelUser.toString(),
      costCenter: user.costCenter,
    });
    setCurrentUserId(user.id);
    setEditMode(true);
    setActiveTab(0); // Muda para a aba de cadastro/edição
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        setLoading(true);
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        setError("Erro ao excluir usuário");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setUserInfo({
      email: "",
      name: "",
      password: "",
      filial: "",
      levelUser: "1",
      costCenter: "",
    });
    setCurrentUserId(null);
    setEditMode(false);
  };
  const getUserLevel = (level) => {
    return level === 2 ? "Administrador" : "Solicitante";
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        resetForm();
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `2px solid ${greenTheme.primary}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: greenTheme.primary,
          color: greenTheme.contrastText,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {editMode ? "Editar Usuário" : "Gerenciar Usuários"}
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: greenTheme.primary,
            },
          }}
        >
          <Tab
            label={editMode ? "Edição" : "Cadastro"}
            sx={{
              "&.Mui-selected": {
                color: greenTheme.primary,
                fontWeight: "bold",
              },
            }}
          />
          <Tab
            label="Usuários Cadastrados"
            sx={{
              "&.Mui-selected": {
                color: greenTheme.primary,
                fontWeight: "bold",
              },
            }}
          />
        </Tabs>

        {error && (
          <Typography
            color="error"
            sx={{
              mt: 2,
              mx: 3,
              textAlign: "center",
              fontWeight: "bold",
              backgroundColor: "#ffeeee",
              p: 1,
              borderRadius: 1,
            }}
          >
            {error}
          </Typography>
        )}

        {activeTab === 0 && (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 2,
              p: 3,
              border: `1px solid ${greenTheme.light}`,
              borderRadius: 2,
              mx: 2,
              backgroundColor: "#f8fff8",
            }}
          >
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              required
              value={userInfo.email}
              onChange={handleChange}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: greenTheme.primary,
                  },
                },
              }}
            />

            <TextField
              label="Nome Completo"
              name="name"
              fullWidth
              margin="normal"
              required
              value={userInfo.name}
              onChange={handleChange}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: greenTheme.primary,
                  },
                },
              }}
            />

            <TextField
              label={
                editMode ? "Nova Senha (deixe em branco para manter)" : "Senha"
              }
              name="password"
              type="password"
              fullWidth
              margin="normal"
              required={!editMode}
              value={userInfo.password}
              onChange={handleChange}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: greenTheme.primary,
                  },
                },
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
              required
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: greenTheme.primary,
                  },
                },
              }}
            >
              <InputLabel>Filial</InputLabel>
              <Select
                name="filial"
                value={userInfo.filial}
                onChange={handleChange}
                label="Filial"
                disabled={loadingFiliais}
              >
                {loadingFiliais ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                    Carregando filiais...
                  </MenuItem>
                ) : filiais.length === 0 ? (
                  <MenuItem disabled>Nenhuma filial disponível</MenuItem>
                ) : (
                  filiais.map((filial) => (
                    <MenuItem key={filial.id} value={filial.id}>
                      {filial.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <TextField
              label="Centro de Custo"
              name="costCenter"
              fullWidth
              margin="normal"
              required
              value={userInfo.costCenter}
              onChange={handleChange}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: greenTheme.primary,
                  },
                },
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
              required
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: greenTheme.primary,
                  },
                },
              }}
            >
              <InputLabel>Nível de Acesso</InputLabel>
              <Select
                name="levelUser"
                value={userInfo.levelUser}
                onChange={handleChange}
                label="Nível de Acesso"
              >
                <MenuItem value="2">Administrador</MenuItem>
                <MenuItem value="1">Solicitante</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                onClick={() => {
                  resetForm();
                  if (editMode) setActiveTab(1);
                  onClose();
                }}
                sx={{
                  mr: 2,
                  color: greenTheme.dark,
                  borderColor: greenTheme.dark,
                  "&:hover": {
                    backgroundColor: "#e8f5e9",
                  },
                }}
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: greenTheme.primary,
                  "&:hover": {
                    bgcolor: greenTheme.dark,
                  },
                }}
                disabled={loading || loadingFiliais}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : editMode ? (
                  "Salvar Alterações"
                ) : (
                  "Cadastrar Usuário"
                )}
              </Button>
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ p: 2 }}>
            <TableContainer
              component={Paper}
              sx={{
                border: `1px solid ${greenTheme.light}`,
                "& .MuiTableHead-root": {
                  bgcolor: "#e8f5e9",
                },
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold", color: greenTheme.dark }}
                    >
                      Nome
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: greenTheme.dark }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: greenTheme.dark }}
                    >
                      Filial
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: greenTheme.dark }}
                    >
                      Nível
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: greenTheme.dark }}
                    >
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingUsers ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Nenhum usuário cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.filial}</TableCell>
                        <TableCell>
                          <Chip
                            label={getUserLevel(user.levelUser)}
                            sx={{
                              backgroundColor:
                                user.levelUser === 2 ? "#e8f5e9" : "#e3f2fd",
                              color:
                                user.levelUser === 2
                                  ? greenTheme.dark
                                  : "#1565c0",
                              fontWeight: "bold",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEdit(user)}
                            sx={{
                              color: greenTheme.primary,
                              "&:hover": {
                                backgroundColor: "#e8f5e9",
                              },
                            }}
                          >
                            <MdEdit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(user.id)}
                            sx={{
                              color: "#d32f2f",
                              "&:hover": {
                                backgroundColor: "#ffebee",
                              },
                            }}
                          >
                            <MdDelete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegisterUserDialog;
